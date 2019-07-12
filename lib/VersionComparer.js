module.exports = class VersionComparer{

    constructor(options) {
        this.options = options;
    }


    latestUpdate(usedModules, callback){
        if (this.options.isUpdateFrom){
            this.options.updateFrom.forEach(item=>{
                usedModules.concatModuleAnalyer(item);
            });
            callback();
        } else {
            const semver = require('semver');
            const packageJson = require('package-json');
            const lodash = require('lodash');
            let iterNum = 0;
            usedModules.modules.forEach((item, key)=>{
                packageJson(key, { fullMetadata: true, allVersions: true })
                    .then(data=>{
                        const sortedVersions = lodash(data.versions)
                            .keys()
                            .remove(lodash.partial(semver.gt, '8000.0.0'))
                            .sort(semver.compare)
                            .valueOf();
                        const latest = data['dist-tags'].latest;
                        const latestStableRelease = semver.satisfies(latest, '*') ?
                            latest :
                            semver.maxSatisfying(sortedVersions, '*');
                        usedModules.modules.set(key, {
                            ...item,
                            latest:latestStableRelease,
                            release:data['time'][latestStableRelease]
                        });
                        iterNum += 1;
                        if (iterNum === usedModules.modules.size){
                            callback();
                        }
                    })
            });
        }
        return usedModules;
    }




    static compare(version, latest){
        let choices = require('./LineWriter').colors();
        let result =void 0;
        if (version && latest){
            const filterMarker = (item)=>{
                if (isNaN(parseInt(item[0], 10))){
                    return item.substr(1);
                }
                return item;
            };
            let availableNumberArr = latest.split('.').map(filterMarker);
            let usedNumberArr = version.split('.').map(filterMarker);

            const placeCompare = (used, available, place) => {
                for (let i = 0; i < used.length; i++) {
                    if (used[i] !== available[i]) {
                        if (used[i] < available[i]) return i < place + 1 ? choices.red : choices.green;
                    }
                }
            };
            switch (version[0]) {
                case '^':
                    result = placeCompare(usedNumberArr, availableNumberArr, 0);
                    break;
                case '~':
                    result = placeCompare(usedNumberArr, availableNumberArr, 1);
                    break;
                default:
                    result = version === latest ? '' : choices.red;
                    break;
            }
        } else {
            if (version === undefined && latest !== undefined){
                result = choices.green;
            }
        }
        return result;
    }


};