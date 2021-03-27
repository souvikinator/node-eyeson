"use strict";
const chalk = require("chalk")

//function to get defined flag property
//including values of the flag
function getflag(flg) {
    //check if flags exists?
    if (!this.flags.hasOwnProperty(flg)) {
        console.log(chalk.red(`getFlag(): "${flg}" doesn't exists for command ${this.name}`));
        process.exit();
    }
    return this.flags[flg];
}

//function to set flags to a specific commands
function setflags(...flagProps) {
    //iterate over each provided
    //flag props and set it to the command
    for (let i in flagProps) {
        //check for args type
        if (typeof flagProps[i] !== "object") {
            console.error(chalk.red(`setFlags(): invalid argument type, argument type has to be Object`));
            process.exit();
        }
        //FIXME:
        // let tmpf = { ...flagObj };
        let tmpf = Object.assign({
            name: "",
            type: "boolean",
            value: false,
            usage: ""
        }, flagProps[i]);
        //check for same type i.e options.value should have same type as options.type
        if (typeof (tmpf.value) !== tmpf.type) {
            console.error(chalk.red(`setFlags(): flag ${tmpf.name} has value of invalid type. Flag takes value of type ${tmpf.type}`));
            process.exit();
        }
        //check if flag already exists
        if (this.flags.hasOwnProperty(tmpf.name)) {
            console.error(chalk.red(`setFlags(): flag ${tmpf.name} already exists with the ${this.name}.`));
            process.exit();
        }
        // console.log(`\nsetFlags::${this.name}::${tmpf.name}|\n`, cmdObj);
        this.flags[tmpf.name] = { ...tmpf };
        this.flags[tmpf.name]['isPresent'] = false;
    }

}


function Termparse() {
    //displays usage menu
    this.commands = new Object();
    //function used to define new commands
    //takes in object property of the command
    this.addCommand = function (options) {

        //assigning the passed options to the tmp cmdObj
        // FIXME:
        // let tmp = { ...cmdObj };
        options = Object.assign({
            name: "",
            usage: "",
            run: function () { },
            flags: {},
            setFlags: setflags,
            getFlag: getflag
        }, options)
        //error handling
        if (options.name.length === 0) {
            console.error(chalk.red("addCommand(): command name cannot be empty"));
            process.exit();
        }

        //if command already exists
        if (this.commands.hasOwnProperty(options.name)) {
            console.error(chalk.red(`addCommand(): cannot have two commands with same name, ${options.name} already exists`));
            process.exit();
        }

        if (typeof options.run !== "function") {
            console.error(chalk.red(`addCommand(): no functionality added to ${cmd}. add one by passing a function to run property `));
            process.exit();
        }
        this.commands[options.name] = { ...options };
        //for chaining
        return this.commands[options.name];
    }

    //args[0]: command
    this.parse = function (args) {
        if (args.length === 0) {
            this.showHelp();
            process.exit();
        }
        let cmd = args[0];//command
        let cmd_args = args.slice(1);//args except command 
        // TODO: study this
        let rxp1 = new RegExp("^\-(.*)\=([^]*)"); //for -flag=value
        let rxp2 = new RegExp("^\-(.*)"); //for -flag value
        this.args = new Array();

        //check if `-help` flag
        if (cmd === "-help") {
            this.showHelp();
            process.exit();
        }

        //check if command exists
        if (!this.commands.hasOwnProperty(cmd)) {
            console.log(chalk.red(`unknown command : "${cmd}"`));
            this.showHelp();
            process.exit();
        }

        for (let n in cmd_args) {
            //applyting regular exp on each args
            let rxp1_res = rxp1.exec(cmd_args[n]);
            let rxp2_res = rxp2.exec(cmd_args[n]);

            if (rxp1_res !== null) {
                //for flag of type -flag=value
                //if command has the flag
                if (!this.commands[cmd].flags.hasOwnProperty(rxp1_res[1])) {
                    console.log(chalk.red(`unknown flag : "${rxp1_res[1]}"`));
                    this.showHelp();
                    process.exit();
                }

                let flg_obj = this.commands[cmd].flags[rxp1_res[1]];

                //if flag exists and the type is boolean
                if (flg_obj.type === "boolean") {
                    flg_obj.value = true;
                    flg_obj.isPresent = true;
                }
                //if flag exists and the type is string then next arg is it's value
                if (flg_obj.type === "string") {
                    let flag_val_type = typeof (rxp1_res[2]);
                    //check if value passed?
                    if (flag_val_type === "undefined" || flag_val_type === "null" || rxp1_res[2].length === 0) {
                        console.log(chalk.red(`'-${rxp1_res[1]}' used but no value passed`));
                        process.exit();
                    }
                    flg_obj.value = rxp1_res[2];
                    flg_obj.isPresent = true;
                }

            } else if (rxp2_res !== null) {
                //for flags of type -flag or -flag value
                if (!this.commands[cmd].flags.hasOwnProperty(rxp2_res[1])) {
                    console.log(chalk.red(`unknown flag : "${rxp2_res[1]}"`));
                    this.showHelp();
                    process.exit();
                }
                let flg_obj = this.commands[cmd].flags[rxp2_res[1]];
                console.log(typeof flg_obj.value)
                //if flag exists and the type is boolean
                if (flg_obj.type === "boolean") {
                    flg_obj.value = true;
                    flg_obj.isPresent = true;
                }
                //if flag exists and the type is string then next arg is it's value
                if (flg_obj.type === "string") {
                    //error handling
                    //TODO: why below line?
                    let flag_val_type = typeof (cmd_args[parseInt(n) + 1]);
                    if (flag_val_type === "undefined" || flag_val_type === "null") {
                        console.log(chalk.red(`'-${rxp2_res[1]}' used but no value passed`));
                        process.exit();
                    }
                    flg_obj.value = cmd_args[parseInt(n) + 1];
                    flg_obj.isPresent=true;
                    //remove already parsed command line args
                    cmd_args.splice(parseInt(n) + 1, 1); //remove the next element to avoid conflict
                }
            } else {
                //rest are arguments. store them
                this.args.push(cmd_args[n]);
            }

        }
        //executing command action
        this.commands[cmd].run();
    }

    this.showHelp = function () {
        let usage_guide = "";
        for (let cmd in this.commands) {
            if (this.commands[cmd].hasOwnProperty("usage")) {

                usage_guide += `
    ${chalk.blueBright("Command:")} ${this.commands[cmd].name}

    ${chalk.magentaBright("Usage:")} ${this.commands[cmd].usage}

    ${chalk.greenBright("Flags:")}
    `;
                // TODO: make it clean
                for (let flg in this.commands[cmd].flags) {
                    usage_guide += `
    -${this.commands[cmd].flags[flg].name}    ${this.commands[cmd].flags[flg].type}    ${this.commands[cmd].flags[flg].usage}
    `;
                }
            }
        }
        usage_guide += `
    ${chalk.yellowBright("General:")}
    -help       display usage guide
    `;
        console.log(usage_guide);
    }


}

module.exports = Termparse;