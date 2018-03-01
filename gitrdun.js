#!/usr/bin/env node

var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var util = require('util');

function Git() {
    this.clone = function (repo, dir) {
        var cmd = util.format('git clone --depth 1 --no-single-branch %s %s', repo, dir);
        execute(cmd);
    };

    this.checkout = function (branch, dir) {
        var cmd = util.format('git -C %s checkout -f remotes/origin/%s', dir, branch);
        execute(cmd);
    };

    this.fetch = function (dir) {
        var cmd = util.format('git -C %s fetch', dir);
        execute(cmd);
    };

    function execute(cmd) {
        console.log(cmd);
        exec(cmd, { stdio: [0, 1, 2] });
    }
}

function Installer(git) {
    this.install = function(dir) {
        var gitrdunJson = path.resolve(dir, './gitrdun.json');

        if (!fs.existsSync(gitrdunJson)) {
            console.log(util.format('No gitrdun.json file found in %s, skipping...', dir));
            return;
        }

        var config = JSON.parse(fs.readFileSync(gitrdunJson));

        for (var repoName in config.dependencies) {
            var repoConfig = config.dependencies[repoName];
            var repoDir = path.resolve(dir, config.directory, repoName);

            if (fs.existsSync(repoDir)) {
                git.fetch(repoDir);
            }
            else {
                git.clone(repoConfig.url, repoDir);
            }

            git.checkout(repoConfig.branch, repoDir);

            if (repoConfig.paths) {
                this.clean(repoDir, repoConfig.paths);
            }

            this.install(repoDir);
        }
    };

    this.clean = function(baseDir, pathsToKeep) {
        var pathsToKeepLowerCase = pathsToKeep.map(function(path) { return path.toLowerCase(); });
        var subPaths = fs.readdirSync(baseDir);

        for (var i in subPaths) {
            var subPath = subPaths[i].toLowerCase();
            var fullPath = path.join(baseDir, subPath);
            var isGitFolder = subPath == '.git';
            var shouldDelete = !isSubPathInList(subPath, pathsToKeepLowerCase) && !isGitFolder;

            if (shouldDelete) {
                rimraf.sync(fullPath);
            }
            else if (fs.lstatSync(fullPath).isDirectory() && !isGitFolder) {
                var subDir = path.join(baseDir, subPath);
                this.clean(subDir, pathsToKeep);
            }
        }
    };

    var isSubPathInList = function(path, list) {
        for (var i in list) {
            var item = list[i];

            if (item.indexOf(path) >= 0) {
                return true;
            }
        }

        return false;
    };
}

function main() {
    var git = new Git();
    var installer = new Installer(git);
    var cwd = process.cwd();

    installer.install(cwd);
}

main();
