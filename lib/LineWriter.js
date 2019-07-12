module.exports = class LineWriter{

    constructor(options) {
        this.options = options;
        this.packegeNameMax = 60;
        this.info = `${
            LineWriter.colors().reset
        }Package Update Remind: ${
            LineWriter.colors().green
        }green${
            LineWriter.colors().reset
        } means it can be updated safely, ${
            LineWriter.colors().red
            }red${
            LineWriter.colors().reset
            } means may have problems with compatibility, white means no new version detect\n`;
    }

    static colors() {
        return {
            reset:"\x1b[0m", //no version update detect
            red:"\x1b[31m",  //update may have problems with compatibility
            green:"\x1b[32m" //can update safely
        };
    }


    regulateMessages(name, message, color){
        let version = message.version ? message.version : 'not installed';
        let lastest = message.latest ? message.latest : 'no higher version';
        let release = message.release ? message.release : '';
        color = color ? color : '';
        let start = ` ${name}: ${version}`;

        return `${
            LineWriter.colors().reset
        } ${
            name
            }: ${
            version
        }${
            new Array(this.packegeNameMax - start.length > 0 ? this.packegeNameMax - start.length : 0)
                .fill(' ').join('')
        }--->    ${
            color
        } ${
            lastest
        }${
            this.options.showReleaseTime && !this.options.isUpdateFrom ?
                ' released on ' + release : ''
        }\n`;
    }


    draw(name, message, color){
        if (this.options.onlyShowAvailable){
            if (color === LineWriter.colors().green){
                this.info += this.regulateMessages(name, message, color);
            }
        } else {
            this.info += this.regulateMessages(name, message, color);
        }
        return this;
    }

    end(){
        this.info += `${LineWriter.colors().reset}Package Update Remind End`;
        return this.info;
    }


};