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
    "install": "pwd",
    "dependencies": {
        "gitrdun": {
            "url": "https://github.com/jpipher/gitrdun.git",
            "branch": "master",
            "shallow": true,
            "install": "pwd"
        }
    }
}
```

NOTES:
* The "install" script will be run after dependencies are fetched from git
* An "install" script can be defined for a dependency and will be run after the dependency has been fetched from git
* Set "shallow" to true if you do not want to recursively install with gitrdun
