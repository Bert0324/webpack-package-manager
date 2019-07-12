module.exports = class PackageManager{

    constructor(options){
        this.options = {
            onlyShowAvailable: false,   //only show packages that can be updated
            autoUpdate:false,           //automatically update available packages
            showReleaseTime:false,      //show release time of latest version
            updateFrom: void 0,         //Array: another package.json files, will choose newest version from them
            ...options
        };

        this.options.isUpdateFrom = Object.prototype.toString.call(this.options.updateFrom) === "[object Array]";
        this.plugin = {name:this.constructor.name};

        this.usedModules = void 0;      //ModuleAnalyser instance
        this.Writer = require('./LineWriter');
        this.VersionComparer = require('./VersionComparer');
    }


    createMessage(){
        let write = new this.Writer(this.options);
        this.usedModules.modules.forEach((item, key)=>{
            let color = this.VersionComparer.compare(item.version, item.latest);
            write = write.draw(key, item, color);
            this.usedModules.modules.set(key, {
                ...item,
                color:color
            })
        });
        console.log(write.end());
    }


    autoUpdate(){
        if (this.options.autoUpdate){
            this.usedModules.modules.forEach((item, key)=>{
                if (item.color){
                    if (item.color === this.Writer.colors().green) {
                        require('child_process').exec(`npm install ${key}@${item.latest}`, ()=>{
                            console.log(`${key} has ${item.version ? 'from' + item.version : ''} updated to ${item.latest}`);
                        });
                    }
                }
            });
        }
    }


    apply(compiler){
        const doneCompileAsync = stats => {
            this.usedModules =  new (require('./ModuleAnalyer'))(`${compiler.options.context}/package.json`, stats);
            let versionComparer = new this.VersionComparer(this.options);
            this.usedModules = versionComparer.latestUpdate(this.usedModules, ()=>{
                this.createMessage();
                this.autoUpdate();
            });
        };
        if (compiler.hooks){
            compiler.hooks.done.tapAsync(this.plugin, doneCompileAsync);
        } else {
            compiler.plugin('done', doneCompileAsync);
        }
    }
};