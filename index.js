import path from "path";
const checkPath = absolutePath => {
    if (! path.isAbsolute(absolutePath)) {
        throw new Error("Path isn't absolute.");
    }
};
let relativeBasePath = process.cwd();
let sandboxScope = relativeBasePath;

path.sandboxPath = absolutePath => {
    if (! path.isAbsolute(absolutePath)) {
        throw new Error("Path isn't absolute. If it's supposed to be relative, use path.accessLocal instead.");
    }

    if (! absolutePath.startsWith(sandboxScope)) { // The base path must appear at the start of the path
        throw new Error(`Attempted to access a file or folder outside of the local path.\nFull path:\n${absolutePath}\nShould be in this scope:\n${sandboxScope}\n\nIf you don't want to change the sandbox or you're sure you're only reading, you can use path.accessOutsideLocal instead. Your relative base path may also be working against you, you may want to call path.setRelativeBasePath.matchSandbox after you change the sandbox scope (if you're doing that).\n`);
    }
    return absolutePath;
};
path.accessLocal = localPath => path.sandboxPath(path.join(relativeBasePath, localPath));
path.accessOutsideLocal = localPath => path.join(relativeBasePath, localPath);
path.accessOutside = absolutePath => absolutePath;

path.changeSandboxScope = {
    setAbsolute: absolutePath => {
        checkPath(absolutePath);
        sandboxScope = absolutePath;
    },
    setRelative: relativePath => {
        sandboxScope = path.join(sandboxScope, relativePath);
    },
    backOne: _ => {
        sandboxScope = path.join(sandboxScope, "../");
    },
    matchRelative: _ => {
        sandboxScope = relativeBasePath;
    }
};
path.changeRelativeBasePath = {
    setAbsolute: absolutePath => {
        checkPath(absolutePath);
        relativeBasePath = absolutePath;
    },
    setRelative: relativePath => {
        relativeBasePath = path.join(relativeBasePath, relativePath);
    },
    backOne: _ => {
        relativeBasePath = path.join(relativePath, "../");
    },
    matchSandbox: _ => {
        relativeBasePath = sandboxScope;
    }
};
export default path;