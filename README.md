# sanboxed-path

sandboxed-path is a very simple replacement for the built-in path module. It adds a few more methods to let you sandbox paths.

# Some things to note
1. The sandboxing happens when generating paths for accessing files, which you need to do by calling one of the methods. **The sandbox won't do anything if you specify a path to a file system function without first passing it through one of the sandbox functions**.

2. While I've tested it in very basic conditions, it's possible there are bugs that let you escape the sandbox (although unlikely). You should still be a bit careful when working with files.

# Getting Started
In many cases, you can just start using the functions and not configure anything. Just install and import with:

```
npm install sandboxed-path
```

And

```js
const path = require("sandboxed-path");
```

And then use it a bit like this:

```js
// These are all local paths, but the functions produce absolute paths
fs.writeFile(path.accessLocal("foo.txt"), "bar"); // Fine because it's in the sandbox
fs.writeFile(path.accessLocal("../foo.txt"), "bar"); // Error prevents file from being written due to the path being outside of the sandbox
fs.writeFile(path.accessOutsideLocal("../foo.txt"), "bar"); // Fine because outside local *doesn't* have sandboxing

// Again but with absolute paths
fs.writeFile(path.sandboxPath("/Users/bob/Documents/example-project/foo.txt"), "bar"); // Fine because it's in the sandbox (assuming the program is located here)
fs.writeFile(path.sandboxPath("/Users/bob/Documents/foo.txt"), "bar"); // Again, outside sandbox so the error stops it
fs.writeFile(path.accessOutside("/Users/bob/foo.txt"), "bar"); // Fine because accessOutside *doesn't* have sandboxing
fs.writeFile("/Users/bob/foo.txt", "bar"); // Fine because none of the methods were called
// ^^ This is actually identical to the line above it though, as accessOutside just returns its input. But calling the function makes it clearer that you intended to leave the sandbox
```

Initially the sandbox scope and base for relative paths are set to the folder the script that imported the module is in. But you might want to change one or both of these.

For example, if you've split your code up into a static and server folder, you probably want to be able to access the static folder from the server folder. You'd do this with:

```js
path.changeSandboxScope.backOne();
```

This would then allow you to access everything in your project's folder.

**Warning**: The sandbox scope and base for relative paths are separate. While they are initially the same, you have to modify them individually. In the example above, although a folder up one can now be accessed, the paths are still relative to the folder containing the script that imported the module. See below for how to change the base for relative paths.

You can also independently change where the relative paths are measured from. You'll probably just want to do this with `path.changeRelativeBasePath.matchSandbox()` but there are some other methods listed in the next section...

# Functions
* **`sandboxPath(absolutePath : string)`** => sandboxedAbsolutePath : string

    Takes an **absolute** path and makes sure it's in the sandbox. Otherwise throws an error.

* **`accessLocal(relativePath : string)`** => sandboxedAbsolutePath : string

    Takes a **relative** path, makes it absolute and makes sure it's in the sandbox. Otherwise throws an error.

* **`accessOutsideLocal(relativePath : string)`** => notSandboxedAbsolutePath : string

    Takes a **relative** path and **only** makes it absolute. **Doesn't sandbox** but makes it's clearer that it's intentional.

* **`changeSandboxScope`/`changeRelativeBasePath`** are objects which both contain very similar functions:

    -> **`setAbsolute(absolutePath : string)`** => void

    Sets the sandbox scope or relative base path to an **absolute** path.

    -> **`setRelative(relativePath : string)`** => void

    Sets the sandbox scope or relative base path to a **relative** path. Both are relative to their current values, as opposed to **only** the relative path.

    -> **`backOne()`** => void

    Makes the sandbox scope or relative base path go up a directory. Equivalent to `setRelative("../")`

    -> **`matchRelative()`/`matchSandbox()`** => void

    changeSandboxScope only has `matchRelative()`, and changeRelativeBasePath only has `matchSandbox()`. Sets them to be equal in a particular direction.