const chalk=require('chalk');

var termparse=function(){};

//args[0]: command
termparse.prototype.parse=function(args){
    if(args.length===0){
        this.showHelp();
        process.exit();
    }
    let command=args[0];//command
    let command_args=args.slice(1);//args except command 
    let rxp1=new RegExp("^\-(.*)\=([^]*)"); //for -flag=value
    let rxp2=new RegExp("^\-(.*)"); //for -flag
    this.args=new Array();
    
    //check if `-help` flag
    if(command==="-help"){
        this.showHelp();
        process.exit();
    }
    
    //if command is not defined by user
    if(!this.hasOwnProperty(command)){
        console.log(chalk.red(`unknown command : "${args[0]}"`));
        this.showHelp();
        process.exit(); 
    }

    //FIXME:change for loop
    for(n in command_args){
        let rxp1_res=rxp1.exec(command_args[n]);
        let rxp2_res=rxp2.exec(command_args[n]);

        if(rxp1_res!==null){
            //for flag of type -flag=value
            //if command has the flag
            if(!this[command].flags.hasOwnProperty(rxp1_res[1])){
                console.log(chalk.red(`unknown flag : "${rxp1_res[1]}"`));
                this.showHelp();
                process.exit();
            }

            let flg_obj=this[command].flags[rxp1_res[1]];
            
            //if flag exists and the type is boolean
            if(flg_obj.type==="boolean"){
                flg_obj.value=true;
                flg_obj.present=true;
            }
            //if flag exists and the type is string then next arg is it's value
            if(flg_obj.type==="string"){
                let flag_val_type=typeof(rxp1_res[2]);
                if(flag_val_type==="undefined"||flag_val_type==="null"||rxp1_res[2].length===0){
                    console.log(chalk.red(`'-${rxp1_res[1]}' used but no value passed`));
                    process.exit();
                }
                flg_obj.value=rxp1_res[2];
                flg_obj.present=true;
            }
            
        }else if(rxp2_res!==null){
            //for flags of type -flag or -flag value
            if(!this[command].flags.hasOwnProperty(rxp2_res[1])){
                console.log(chalk.red(`unknown flag : "${rxp2_res[1]}"`));
                this.showHelp();
                process.exit();
            }
            let flg_obj=this[command].flags[rxp2_res[1]];
            //if flag exists and the type is boolean
            if(flg_obj.type==="boolean"){
                flg_obj.value=true;
            }
            //if flag exists and the type is string then next arg is it's value
            if(flg_obj.type==="string"){
                //error handling
                let flag_val_type=typeof(command_args[parseInt(n)+1]);
                if(flag_val_type==="undefined" || flag_val_type==="null"){
                    console.log(chalk.red(`'-${rxp2_res[1]}' used but no value passed`));
                    process.exit();
                }
                flg_obj.value=command_args[parseInt(n)+1];
                command_args.splice(parseInt(n)+1,1); //remove the next element to avoid conflict
            }
        }else{
            //rest are arguments. store them
            this.args.push(command_args[n]);
        }

    }
    //executing command
    this[command].run();
}


//adds help/guide to the this.
termparse.prototype.showHelp=function(){
    var usage_guide="";
    for(cmd in this){
        if(this[cmd].hasOwnProperty("usage")){
            
            usage_guide+=`
        ${chalk.blueBright("Command:")} ${cmd}

        ${chalk.magentaBright("Usage:")} ${this[cmd].usage}
            
        ${chalk.greenBright("Flags:")}
            `;
            for(flag in this[cmd].flags){
                usage_guide+=`
        -${flag}    ${this[cmd].flags[flag].type}    ${this[cmd].flags[flag].usage}
                `;
            }
        } 
    }
    usage_guide+=`
        ${chalk.yellowBright("General:")}
        -help       shows this usage guide
            `;
    console.log(usage_guide);
}

//adds/defines command
termparse.prototype.addCommand=function(options){
    
    options=Object.assign({
        name:"",
        usage:"",
    },options);

    //error handling
    if(options.name.length===0){
        console.error(chalk.red("addCommand(): termparse.commands requires arg. refer doc for more info"));
        process.exit();
    }
    
    if(this.hasOwnProperty(options.name)){
        console.error(chalk.red(`addCommand(): cannot have two commands with same name, ${options.name} already exists`));
        process.exit();
    }

    if(!options.hasOwnProperty("run")){
        console.error(chalk.red(`addCommand(): no functionality added to command. args also takes key "run" as function`));
        process.exit();
    }
    
    if(typeof(options.run)!=="function"){
            console.error(chalk.red(`addCommand(): no functionality added to ${cmd}. add one by passing a function to run: of the command`));
            process.exit();
    }
    //error handling end

    this[options.name]=new Object();
    this[options.name]["usage"]=options.usage;
    this[options.name]["run"]=options.run;
    this[options.name]["flags"]=new Object();
}

//for getting flag
termparse.prototype.getFlag=function(cmd,cmd_flg){
    if(!this.hasOwnProperty(cmd)){
        console.log(chalk.red(`getFlag(): "${cmd}" command does not exist`));
        process.exit();
    }
    if(!this[cmd].flags.hasOwnProperty(cmd_flg)){

        console.log(chalk.red(`getFlag(): flag "${cmd_flg}" does not exist for command "${cmd}"`));
        process.exit();
    }
    return (this[cmd].flags[cmd_flg]);
}

//for setting flags
termparse.prototype.setFlag=function(cmd,options){
    options=Object.assign({
        name:"",
        type:"boolean",
        value:false,
        present:false,
        usage:""
    },options);
    
    if(!this.hasOwnProperty(cmd)){
        console.log(chalk.red(`setFlag(): "${cmd}" command does not exist`));
        process.exit();
    }
    
    if(options.name.length===0){
        console.error(chalk.red("setFlag(): flag name is required"));
        process.exit();
    }
    
    if(this[cmd].flags.hasOwnProperty(options.name)){
        console.log(chalk.red(`setFlag(): cannot have two flags with same name : "${options.name}" `));
        process.exit();
    }
    //error handling end
    this[cmd].flags[options.name]=new Object();

    //this[command name].flags[type/value/usage]
    let flags_obj=this[cmd].flags[options.name];
    
    flags_obj["type"]=options.type;
    flags_obj["value"]=options.value;
    flags_obj["usage"]=options.usage;
}

//exporting
exports.init=termparse;
