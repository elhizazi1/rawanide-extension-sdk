// Declared in manifest.json; handler registered in hosted JS.
rawanide.commands.registerCommand('local.sdk-hello.sayHello', 'Hello RawanIDE: Say Hello', function () {
  rawanide.window.showToast('Hello from RawanIDE SDK!');
  return { message: 'Hello from RawanIDE SDK!' };
});
