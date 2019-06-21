# gitrdun #

A package manager for git repo dependencies.

## Installation ##


```
npm install -g gitrdun
```

## Instructions ##

Run the following in a repo containing a **gitrdun.json** file. 

```
gitrdun
```

Git repo dependencies will be installed in configured directory.

## Sample gitrdun.json ##

```json
{
    "directory": "lib_gitrdun",
    "dependencies": {
        "gitrdun": {
            "url": "https://github.com/jpipher/gitrdun.git",
            "branch": "master",
            "single": false,
            "paths": [
                "gitrdun.js",
                "package.json"
            ]
        }
    }
}
```

NOTES:
* If no "paths" node is specified for a repo, the entire repo will be kept.
* Set "single" to true if you do not want to recursively install with gitrdun
