#!/usr/bin/env node 

const fs=require('fs');
const chalk=require('chalk'); 
const Termparse=require('./termparse');
const spawnSync=require('child_process').spawnSync;

var termparse=new Termparse.init();

const banner=()=>{
let B1='█▀▀ █▄█ █▀▀ █▀ █▀█ █▄░█';
let B2='██▄ ░█░ ██▄ ▄█ █▄█ █░▀█';
    console.log(chalk.hex('#00ff00')(B1));
    console.log(chalk.hex('#ffff00')(B2));
}

//args is list of files(not flags/options)
var filter_files=function(args){
    var file_info_list=new Object();
    var found_files="";
    var not_found_files="";
    args.map(f=>{
        if(fs.existsSync(f)){
            file_info_list[f]=new Object();
            file_info_list[f].exists=true;
            file_info_list[f].modified=false;
            file_info_list[f].exists=true;
            file_info_list[f].mod_time_ms=fs.statSync(f).mtimeMs;
            file_info_list[f].mod_time=fs.statSync(f).mtime;
            found_files+=` ${f}`; //update found files list
        }else{
            not_found_files+=` ${f}`; //update not found files list
        }
    });
    if(found_files.length>0) console.log(chalk.whiteBright.bgGreenBright(`FOUND`),chalk.underline(found_files));
    
    if(not_found_files.length>0){
        console.log(chalk.whiteBright.bgRed(`NOT FOUND`),chalk.underline(not_found_files));
        console.log(chalk.red.italic('\nfiles are missing among the files passed.'));
        console.log(chalk.red('exiting...'));
        process.exit(); 
    }

    return file_info_list;
}


//checks for modified file and gives signal
var onChange=(f,file_info_list)=>{
    if(fs.existsSync(f)){
      var f_info=fs.statSync(f);
        if(file_info_list[f].mod_time_ms!==f_info.mtimeMs){
            file_info_list[f].mod_time_ms=f_info.mtimeMs;
            file_info_list[f].mod_time=f_info.mtime;
            file_info_list[f].exists=true;
            file_info_list[f].modified=true;
        }else{
            file_info_list[f].modified=false;
        }
    }else{
        file_info_list[f].exists=false;
    }
    return file_info_list;
}

//TODO: detect exit key and give options
//takes string as input=> splits based on line break => splits based on spaces 
var commandExec=function(raw_cmd){
    let cmds=raw_cmd.split('\n');
    for (c of cmds){
        if(c.length>0){ 
            let p_cmd=c.split(" ");
            var cmd_res = spawnSync(p_cmd[0], p_cmd.slice(1), { encoding : 'utf8'  });
                        
            if(cmd_res.stderr.length>0){
                console.log(chalk.blueBright("executing command...")); 
                console.log(chalk.whiteBright.bgRed.underline("ERR:"),"\n",cmd_res.stderr);
                console.log(chalk.yellow("waiting for changes in file")); 
                break;
            }
            if(cmd_res.stdout.length>0){
                console.log(chalk.blueBright("executing command...")); 
                console.log(chalk.whiteBright.bgGreenBright.underline(c),"\n",cmd_res.stdout);
                console.log(chalk.blueBright("command exected")); 
            }
        }
    }
}

//calls onChange() => receives signal => gives appropriate message
//cmd_list :string
var watch=(file_info_list,cmd_list)=>{
    if(Object.keys(file_info_list).length===0){
        console.log(chalk.redBright.italic(`\nno files left to watch`));
        console.log(chalk.redBright('exiting...'));
        process.exit();
    }
    for(file in file_info_list){
        file_info_list=onChange(file,file_info_list);
        mod_time=file_info_list[file].mod_time;
        if(!file_info_list[file].exists){
            console.log("\n---------------------------------------------");
            console.log(`${mod_time} :: ${file} :: ${chalk.yellowBright.bold('DELETED')}`);
            delete file_info_list[file];
            console.log("---------------------------------------------\n");
        }else if(file_info_list[file].modified) {
            console.log("\n---------------------------------------------");
            console.log(`${mod_time} :: ${file} :: ${chalk.blueBright.bold('MODIFIED')}`);
            commandExec(cmd_list);
            console.log("---------------------------------------------\n");
        }
    }
}

/******************** driver code **************************/

//command: watch => watches over one or multiple files
termparse.addCommand({
    name:"watch",
    usage:"used to watch over one or multiple file",
    run:function(){
        if(termparse.args.length===0){
            console.log(chalk.red("no file name or pattern passed"));
            process.exit();
        }

        let exec_command=termparse.getFlag('watch', 'c');
        let time_interval=termparse.getFlag('watch', 't');

        banner();
        console.log(chalk.green.bold('starting...'));
        let file_list=filter_files(termparse.args);
        console.log(chalk.greenBright.bold('watching...'));
        setInterval(()=>{
            watch(file_list,exec_command.value);
        },parseInt(time_interval.value));
    }
});

//setting flags/options for file command
//set custom time interval
termparse.setFlag('watch',{
    name:"t",
    type:"string",
    value:2000,
    usage:"takes time in milliseconds as input to set the watch interval (default: 2000ms/2s )"
})
//set custom commands to execute after file modification
termparse.setFlag('watch', {
    name:"c",
    type:"string",
    value:"",
    usage:"takes one or multiple commands and executes on modification of file"
})


var args=process.argv.slice(2);
termparse.parse(args); //parsing args and executing appropriate command
