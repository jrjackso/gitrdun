#!/usr/bin/env node

var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
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
}

function Installer(git) {
    this.install = function(dir) {
        var gitrdunJson = path.resolve(dir, './gitrdun.json');

        if (!fs.existsSync(gitrdunJson)) {
            console.log(util.format('No gitrdun.json file found in %s, skipping...', dir));
            return;
        }

        process.chdir(dir);

        var config = JSON.parse(fs.readFileSync(gitrdunJson));

        if (config.install) {
            execute(config.install);
        }

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

            if (repoConfig.install) {
                process.chdir(repoDir);
                execute(repoConfig.install);
                process.chdir(dir);
            }

            if (!repoConfig.shallow) {
                this.install(repoDir);
            }
        }
    };
}

function execute(cmd) {
    console.log(cmd);
    exec(cmd, { stdio: [0, 1, 2] });
}

function main() {
    var git = new Git();
    var installer = new Installer(git);
    var cwd = process.cwd();

    installer.install(cwd);
}

main();
