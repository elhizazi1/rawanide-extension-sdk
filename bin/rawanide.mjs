#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {isCompatibleApiVersion} from '../lib/api-version.mjs';
import {listFiles,makeZip} from '../lib/zip.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const contract=JSON.parse(fs.readFileSync(path.join(here,'../contract.json'),'utf8'));
const rules=JSON.parse(fs.readFileSync(path.join(here,'../community-rules.json'),'utf8'));
const sdkVersion=JSON.parse(fs.readFileSync(path.join(here,'../package.json'),'utf8')).version;
const [,,command,...rawArgs]=process.argv;
const flags=new Set(rawArgs.filter(a=>a.startsWith('--')));
const args=rawArgs.filter(a=>!a.startsWith('--')); // positional arguments only
const sdkRoot=path.resolve(here,'..');
const workspace=process.env.RAWANIDE_SDK_WORKSPACE || path.join(sdkRoot,'workspace');
const projectsDir=path.join(workspace,'projects');
const isBareName=(value)=>typeof value==='string'&&value.length>0&&value!=='.'&&value!=='..'&&!value.includes('/')&&!value.includes('\\')&&!path.isAbsolute(value);
const projectPath=(value)=>{
 if(!value)return process.cwd();
 const local=path.resolve(value);
 if(fs.existsSync(local))return local; // Preserve existing explicit and legacy relative paths.
 if(isBareName(value)){
  const managed=path.join(projectsDir,value);
  if(fs.existsSync(managed))return managed;
 }
 return local;
};
const archivePath=(value,project)=>{
 if(value)return path.resolve(value);
 return path.join(project,path.basename(project)+'.r1');
};
const fail=(msg)=>{console.error('ERROR: '+msg);process.exitCode=1};
function validate(manifest,files=[],source='community'){
 const errors=[];
 const add=(x)=>errors.push(x);
 if(!manifest||typeof manifest!=='object'||Array.isArray(manifest))return ['Manifest must be a JSON object'];
 if(!/^[a-z0-9][a-z0-9._-]{2,127}$/.test(manifest.id||''))add('Invalid id');
 if(typeof manifest.name!=='string'||!manifest.name.trim())add('Missing name');
 if(typeof manifest.version!=='string'||!manifest.version.trim())add('Missing version');
 if(!isCompatibleApiVersion(String(manifest.apiVersion??'1.0'),contract.apiVersion))add('Unsupported apiVersion');
 const runtime=manifest.runtime??'declarative';
 if(!contract.runtimes.includes(runtime))add('Unsupported runtime');
 if(manifest.permissions!==undefined&&!Array.isArray(manifest.permissions))add('permissions must be an array');
 for(const p of Array.isArray(manifest.permissions)?manifest.permissions:[]){
   if(!contract.permissions.includes(p))add('Unknown permission: '+p);
   else if(contract.reservedPermissions.includes(p))add('Reserved permission: '+p);
   else if(contract.officialOnlyPermissions.includes(p)&&source!=='official')add('Official-only permission: '+p);
 }
 if(runtime==='hosted-js'&&!manifest.entrypoint)add('hosted-js requires entrypoint');
 if(Array.isArray(manifest.commands)) {
   const ids=new Set();
   for(const cmd of manifest.commands) {
     if(!cmd||typeof cmd.id!=='string'||!cmd.id.trim())add('Command missing id');
     else if(ids.has(cmd.id))add('Duplicate command id: '+cmd.id);
     else ids.add(cmd.id);
     if(!cmd||typeof cmd.title!=='string'||!cmd.title.trim())add('Command missing title');
     if(runtime==='hosted-js'&&cmd.runtime!==true)add('Hosted JS command requires runtime: true');
   }
 }
 if(manifest.icon!==undefined){
  const icon=manifest.icon;
  if(typeof icon!=='string'||!icon||icon.startsWith('/')||icon.replaceAll('\\','/').split('/').some(x=>!x||x==='..'))add('Unsafe icon path');
  else if(files.length&&!files.includes(icon))add('Icon not found: '+icon);
 }
 if(manifest.entrypoint){
  const ep=manifest.entrypoint;
  if(typeof ep!=='string'||ep.startsWith('/')||ep.replaceAll('\\','/').split('/').some(x=>!x||x==='..'))add('Unsafe entrypoint');
  else if(files.length&&!files.includes(ep))add('Entrypoint not found: '+ep);
 }
 if(manifest.commands!==undefined&&!Array.isArray(manifest.commands))add('commands must be an array');
 if(manifest.activationEvents!==undefined&&(!Array.isArray(manifest.activationEvents)||manifest.activationEvents.some(x=>typeof x!=='string')))add('activationEvents must be an array of strings');
 if(Array.isArray(manifest.permissions)&&new Set(manifest.permissions).size!==manifest.permissions.length)add('Duplicate permissions');
 if(manifest.contextActions!==undefined){
   if(!Array.isArray(manifest.contextActions))add('contextActions must be an array');
   else for(const action of manifest.contextActions){
     if(!action||typeof action.commandId!=='string')add('Context action missing commandId');
     else if(!Array.isArray(manifest.commands)||!manifest.commands.some(c=>c&&c.id===action.commandId))add('Context action references undeclared command: '+action.commandId);
   }
 }
 if(manifest.allowedDomains!==undefined){
   if(!Array.isArray(manifest.allowedDomains)||manifest.allowedDomains.some(x=>typeof x!=='string'||!x.trim()||!/^([a-z0-9-]+\.)*[a-z0-9-]+$/i.test(x)))add('allowedDomains must contain valid hostnames');
   if(Array.isArray(manifest.allowedDomains)&&manifest.allowedDomains.length&&!(manifest.permissions||[]).includes('NETWORK_ACCESS'))add('allowedDomains requires NETWORK_ACCESS');
 }
 if(Array.isArray(manifest.contextActions))for(const action of manifest.contextActions){
   if(action&&action.icon!==undefined){
    const icon=action.icon;
    if(typeof icon!=='string'||!icon||icon.startsWith('/')||icon.replaceAll('\\','/').split('/').some(x=>!x||x==='..'))add('Unsafe context action icon path');
    else if(files.length&&!files.includes(icon))add('Context action icon not found: '+icon);
   }
 }
 if(Array.isArray(manifest.contextActions)){
  const ids=new Set();
  for(const action of manifest.contextActions){
   if(action&&typeof action.id==='string'){
    if(ids.has(action.id))add('Duplicate context action id: '+action.id);
    ids.add(action.id);
   }
  }
 }
 if(manifest.unrestrictedNetwork!==undefined&&typeof manifest.unrestrictedNetwork!=='boolean')add('unrestrictedNetwork must be boolean');
 if(manifest.unrestrictedNetwork===true&&!(manifest.permissions||[]).includes('NETWORK_ACCESS'))add('unrestrictedNetwork requires NETWORK_ACCESS');
 return errors;
}
function repositoryErrors(manifest){
 const errors=[];
 if(!manifest||typeof manifest!=='object'||Array.isArray(manifest))return errors;
 const add=(x)=>errors.push('Repository: '+x);
 if(!new RegExp(rules.versionPattern).test(String(manifest.version||'')))add('version must match '+rules.versionPattern);
 const runtime=manifest.runtime??null;
 if(runtime===null?!rules.allowNoRuntime:!rules.allowedRuntimes.includes(runtime))add('runtime "'+(runtime??'none')+'" is not allowed (allowed: '+rules.allowedRuntimes.join(', ')+(rules.allowNoRuntime?', or none':'')+')');
 for(const p of Array.isArray(manifest.permissions)?manifest.permissions:[])if(rules.blockedPermissions.includes(p))add('permission '+p+' is not allowed');
 if(typeof manifest.icon!=='string'||!manifest.icon)add('manifest "icon" is required');
 for(const lang of rules.requiredLocalizedLanguages){const l=manifest.localizedMetadata&&manifest.localizedMetadata[lang];if(!l||typeof l!=='object')add('localizedMetadata.'+lang+' is required');}
 return errors;
}
const repositoryWarnings=(manifest)=>(rules.recommendedManifestFields||[]).filter(f=>!manifest||typeof manifest[f]!=='string'||!manifest[f].trim()).map(f=>'Repository: "'+f+'" is recommended (it is shown in the catalog)');
const walk=(dir)=>listFiles(dir); // same file selection as the community repository builder

try{
 if(command==='release-check'){
  const root=path.resolve(here,'..');
  const packageJson=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
  const problems=[];
  if(packageJson.private===true)problems.push('package is marked private');
  if(!packageJson.name||!packageJson.version||!packageJson.license)problems.push('missing npm metadata');
  const templates=fs.readdirSync(path.join(root,'templates'),{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name);
  for(const template of templates){
   const folder=path.join(root,'templates',template);
   const manifest=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
   const files=walk(folder);
   for(const error of validate(manifest,files,'community'))problems.push(template+': '+error);
   for(const required of ['README.md','LICENSE','assets/icon.svg'])if(!files.includes(required))problems.push(template+': missing '+required);
   if(manifest.icon!=='assets/icon.svg')problems.push(template+': template icon path mismatch');
   if(Array.isArray(manifest.contextActions))for(const action of manifest.contextActions){
    if(action&&action.icon!=='assets/context-action.svg')problems.push(template+': context action icon must reference assets/context-action.svg');
   }
   if(!manifest.license)problems.push(template+': missing license metadata');
   if(manifest.runtime==='hosted-js'&&files.includes(manifest.entrypoint)){
    const js=fs.readFileSync(path.join(folder,manifest.entrypoint),'utf8');
    const registered=[...js.matchAll(/\bregisterCommand\s*\(\s*['"]([^'"]+)['"]/g)].map(x=>x[1]);
    const declared=(Array.isArray(manifest.commands)?manifest.commands:[]).filter(x=>x&&x.runtime===true).map(x=>x.id);
    for(const id of registered)if(!declared.includes(id))problems.push(template+': unlisted command '+id);
    for(const id of declared)if(!registered.includes(id))problems.push(template+': missing handler '+id);
   }
  }
  const report={sdkVersion:packageJson.version,templatesChecked:templates.length,errors:problems,staticOnly:true};
  console.log(JSON.stringify(report,null,2));
  if(problems.length)process.exitCode=1;
 }else if(command==='audit'){
  const folder=projectPath(args[0]);
  const name=['manifest.json','extension.json'].find(n=>fs.existsSync(path.join(folder,n)));
  if(!name)throw new Error('Missing manifest.json or extension.json');
  const content=fs.readFileSync(path.join(folder,name));
  if(content.length>contract.maxManifestBytes)throw new Error('Manifest exceeds 512 KB');
  const manifest=JSON.parse(content);
  const files=walk(folder);
  const errors=validate(manifest,files,flags.has('--official')?'official':'community');
  const warnings=[];
  if(flags.has('--repository')){errors.push(...repositoryErrors(manifest));warnings.push(...repositoryWarnings(manifest));}
  if(manifest.runtime==='hosted-js'&&manifest.entrypoint&&files.includes(manifest.entrypoint)){
    const js=fs.readFileSync(path.join(folder,manifest.entrypoint),'utf8');
    const registered=[...js.matchAll(/\bregisterCommand\s*\(\s*['"]([^'"]+)['"]/g)].map(x=>x[1]);
    const declared=(Array.isArray(manifest.commands)?manifest.commands:[]).filter(x=>x&&x.runtime===true).map(x=>x.id);
    for(const id of registered)if(!declared.includes(id))errors.push('Registered command not declared in manifest: '+id);
    for(const id of declared)if(!registered.includes(id))errors.push('Declared runtime command missing literal registerCommand handler: '+id);
    if(/\bregisterCommand\s*\(\s*[^'"\s]/.test(js))warnings.push('Dynamic registerCommand arguments cannot be verified statically');
  }
  if(manifest.runtime==='hosted-js'&&!(manifest.activationEvents||[]).length)warnings.push('No activationEvents declared; verify host activation behavior');
  const report={schemaVersion:1,id:manifest.id??null,runtime:manifest.runtime??'declarative',files:files.length,errors,warnings,staticOnly:true};
  console.log(JSON.stringify(report,null,2));
  if(errors.length)process.exitCode=1;
 }else if(command==='inspect'){
  const folder=projectPath(args[0]);
  const name=['manifest.json','extension.json'].find(n=>fs.existsSync(path.join(folder,n)));
  if(!name)throw new Error('Missing manifest.json or extension.json');
  const manifest=JSON.parse(fs.readFileSync(path.join(folder,name),'utf8'));
  const files=walk(folder);
  const errors=validate(manifest,files,flags.has('--official')?'official':'community');
  if(flags.has('--repository'))errors.push(...repositoryErrors(manifest));
  const report={id:manifest.id,version:manifest.version,runtime:manifest.runtime??'declarative',entrypoint:manifest.entrypoint??null,permissions:manifest.permissions??[],commands:(manifest.commands??[]).map(c=>({id:c.id,title:c.title,hidden:c.hidden===true})),contextActions:(manifest.contextActions??[]).length,files:files.length,errors};
  console.log(JSON.stringify(report,null,2));
  if(errors.length)process.exitCode=1;
 }else if(command==='validate'){
  const folder=projectPath(args[0]),name=['manifest.json','extension.json'].find(n=>fs.existsSync(path.join(folder,n)));
  if(!name)throw new Error('Missing manifest.json or extension.json');
  const content=fs.readFileSync(path.join(folder,name));
  if(content.length>contract.maxManifestBytes)throw new Error('Manifest exceeds 512 KB');
  const manifest=JSON.parse(content);
  const files=walk(folder);
  const errors=validate(manifest,files,flags.has('--official')?'official':'community');
  if(flags.has('--repository'))errors.push(...repositoryErrors(manifest));
  if(manifest.runtime==='hosted-js'&&manifest.entrypoint&&files.includes(manifest.entrypoint)){
    const js=fs.readFileSync(path.join(folder,manifest.entrypoint),'utf8');
    const registered=[...js.matchAll(/\bregisterCommand\s*\(\s*['"]([^'"]+)['"]/g)].map(x=>x[1]);
    const declared=(Array.isArray(manifest.commands)?manifest.commands:[]).filter(x=>x&&x.runtime===true).map(x=>x.id);
    for(const id of registered)if(!declared.includes(id))errors.push('Registered command not declared in manifest: '+id);
    for(const id of declared)if(!registered.includes(id))errors.push('Declared runtime command missing literal registerCommand handler: '+id);
  }
  if(errors.length)throw new Error(errors.join('\n'));
  console.log('PASS: RawanIDE API '+contract.apiVersion+' manifest checks'+(flags.has('--repository')?' and community repository rules':'')+' ('+files.length+' files)');
 }else if(command==='pack'){
  const folder=projectPath(args[0]),output=archivePath(args[1],folder);
  execFileSync(process.execPath,[fileURLToPath(import.meta.url),'validate',folder,...(flags.has('--official')?['--official']:[]),...(flags.has('--repository')?['--repository']:[])],{stdio:'inherit'});
  if(!output.endsWith('.r1'))throw new Error('Output filename must end with .r1');
  const names=walk(folder).filter(f=>path.resolve(folder,f)!==output);
  if(names.length>contract.maxEntries)throw new Error('Too many archive entries');
  if(names.reduce((sum,f)=>sum+fs.statSync(path.join(folder,f)).size,0)>contract.maxUncompressedBytes)throw new Error('Uncompressed content exceeds 300 MB');
  // Deterministic archive (sorted names, fixed timestamps): identical to what the community repository builder produces.
  const archive=makeZip(names.map(name=>({name,data:fs.readFileSync(path.join(folder,name))})));
  if(archive.length>contract.maxPackageBytes)throw new Error('Archive exceeds 100 MB');
  fs.mkdirSync(path.dirname(output),{recursive:true});
  const tempOutput=output+'.tmp';
  try{
   fs.writeFileSync(tempOutput,archive);
   fs.renameSync(tempOutput,output);
  }finally{if(fs.existsSync(tempOutput))fs.unlinkSync(tempOutput)}
  console.log('CREATED: '+output+'\nSHA-256: '+crypto.createHash('sha256').update(archive).digest('hex'));
 }else if(command==='init'){
  const kind=args[0]||'hosted-js',requested=args[1]||'rawanide-extension',dest=isBareName(requested)?path.join(projectsDir,requested):path.resolve(requested);
  if(!['hosted-js','declarative','hosted-js-panel','hosted-js-selection-panel','hosted-js-safe-edit','hosted-js-project-search'].includes(kind))throw new Error('Template must be hosted-js, hosted-js-panel, hosted-js-selection-panel, hosted-js-safe-edit, hosted-js-project-search or declarative');
  if(fs.existsSync(dest))throw new Error('Destination already exists');
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.cpSync(path.join(here,'../templates',kind),dest,{recursive:true});
  console.log('CREATED: '+dest);
 }else{
  console.log('RawanIDE Extension SDK '+sdkVersion+'\n  rawanide-sdk test            (source checkout only)\n  rawanide-sdk release-check\n  rawanide-sdk inspect <dir> [--official] [--repository]\n  rawanide-sdk audit <dir> [--official] [--repository]\n  rawanide-sdk init hosted-js|hosted-js-panel|hosted-js-selection-panel|hosted-js-safe-edit|hosted-js-project-search|declarative <name|dir>\n  rawanide-sdk validate <dir> [--official] [--repository]\n  rawanide-sdk pack <dir> [output.r1] [--official] [--repository]\n\n  --repository  also apply the rules of community repositories (GitHub/GitLab templates)');
  if(command&&command!=='help')process.exitCode=1;
 }
}catch(e){fail(e.message)}
