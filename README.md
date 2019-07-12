# A webpack plugin can check package versions, combine package.json, auto update.

## Install

`npm install  webpack-package-manager`

## Start

```JavaScript
const PackageUpdatePlugin = require('webpack-package-manager');
module.exports = {
    plugins:[new PackageUpdatePlugin()]
}
```
In command line when compiling, it wll show like:

Package Update Remind: green means it can be updated safely, red means may have problems with compatibility, white means no new version detect
 redux: ^4.0.0                                    --->     <span style="color:green">4.0.1 released on</span> 
 @material-ui/core: ^4.1.3                        --->     4.1.3 released on 
 react-router-dom: ^5.0.1                         --->     5.0.1 released on 
 react-helmet: ^5.2.1                             --->     5.2.1 released on 
 redux-thunk: ^2.3.0                              --->     2.3.0 released on 
 @material-ui/icons: ^4.2.1                       --->     4.2.1 released on 
 css-loader: 2.1.1                                --->     <span style="color:red"> 3.0.0 released on</span> 
Package Update Remind End


## Options

```JavaScript
const PackageUpdatePlugin = require('webpack-package-manager');
new PackageUpdatePlugin({
    onlyShowAvailable: false,                   
    //whether show the packages that don't need to update, default is false
    autoUpdate:false,                           
    //whether automatically update the packages detected to update, default is false
    showReleaseTime:true,                       
    //whether show latest release time, default is true
    updateFrom:['<other path>/package.json']    
    //an array, the paths that other package.json files you want to combine, if set this options, 
    //the latest version showing will be the highest version among all files instead of npm latest
})
```

If you have issues or want to make some suggestions, welcome to contact me. 