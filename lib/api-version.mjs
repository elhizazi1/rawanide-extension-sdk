/** Same-major, not-newer-minor matching; legacy x.y.0 spellings normalize to x.y. */
export function isCompatibleApiVersion(value, current) {
 const parse=input=>{
  if(typeof input!=='string')return null;
  const parts=input.trim().split('.');
  if(parts.length<1||parts.length>3||parts.some(part=>!/^\d+$/.test(part)))return null;
  if(parts.length===3&&parts[2]!=='0')return null;
  const major=Number(parts[0]),minor=Number(parts[1]||0);
  if(!Number.isInteger(major)||!Number.isInteger(minor)||major>2147483647||minor>2147483647)return null;
  return [major,minor];
 };
 const required=parse(value),host=parse(current);
 return !!required&&!!host&&required[0]===host[0]&&required[1]<=host[1];
}
