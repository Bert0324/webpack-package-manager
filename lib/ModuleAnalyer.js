module.exports = class ModuleAnalyer{

    constructor(path, stats){       //names is an array of string that limits dependencies range
        this.moduleReg = /\.\/node_modules\/([^\/]*)\/([^\.\/]*)(.*)$/g;
        this.names = void 0;
        this.dependencies = require(path).dependencies;
        if (stats){
            let modules = stats.toJson(null).modules;
            Object.keys(modules).forEach(key=>{
                if (modules[key].name && modules[key].issuerName){
                    if (!modules[key].issuerName.startsWith('./node_modules')) {
                        this.extractModuleName(modules[key].name);
                    }
                }
            });
            if (this.names){
                this.names = Array.from(new Set(this.names.filter(item=>{
                    if (item !== undefined){
                        return item;
                    }
                })))
            }
        }
        this.modules = this.getModulesArray(); //Map
    }



    extractModuleName(path){
        let match;
        do {
            match = this.moduleReg.exec(path);
            if (match){
                if (this.names === undefined){
                    this.names = [];
                }
                this.names.push(match[1].startsWith('@') ? `${match[1]}/${match[2].includes('.') ? '' : match[2]}` : match[1]);
            }
        } while (match);
    }


    getModulesArray(){
        let modules = new Map();
        Object.keys(this.dependencies).forEach(key=>{
            if (this.names === undefined){
                modules.set(key, {
                    version: this.dependencies[key]
                })
            } else if (this.names.includes(key)){
                modules.set(key, {
                    version: this.dependencies[key]
                })
            }
        });
        return modules;
    }

    concatModuleAnalyer(path){

        let dependencies = require(path).dependencies;
        if (Object.prototype.toString.call(dependencies) !== '[object Object]'){
            throw new Error('invalid package.json path');
        }
        Object.keys(dependencies).forEach(key=>{
            if (this.modules.has(key)){
                let item = this.modules.get(key);
                if (item.version < dependencies[key]){
                    this.modules.set(key, {
                        ...item,
                        latest:dependencies[key]
                    })
                }
            } else {
                this.modules.set(key, {
                    latest:dependencies[key]
                })
            }
        });
        return this;
    }
};