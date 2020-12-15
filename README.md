<pre>
 ▄▄▄▄▄▄▄ ▄▄   ▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄    ▄▄▄▄▄▄▄ ▄▄    ▄ 
█       █  █ █  █       █       █  █       █  █  █ █
█    ▄▄▄█  █▄█  █    ▄▄▄█  ▄▄▄▄▄█  █   ▄   █   █▄█ █
█   █▄▄▄█       █   █▄▄▄█ █▄▄▄▄▄   █  █ █  █       █
█    ▄▄▄█▄     ▄█    ▄▄▄█▄▄▄▄▄  █  █  █▄█  █  ▄    █
█   █▄▄▄  █   █ █   █▄▄▄ ▄▄▄▄▄█ █  █       █ █ █   █
█▄▄▄▄▄▄▄█ █▄▄▄█ █▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█  █▄▄▄▄▄▄▄█▄█  █▄▄█
</pre>

**Eyes-on** is a minimal Cross-platform command line file watcher which lets user watch for modification/deletion over single/multiple files.


# 📃Features/Todos

- [x]  Watches for *modification* and *deletion* in files
- [x]  Users can change the checking interval of `eyeson` based on their needs
- [x]  Users can pass command to execute which triggers when any file in watch list is *modified*.

# 🔧Installation

Download suitable Eyeson execuatble from [here](https://github.com/DarthCucumber/node-eyeson/releases/tag/v1.0.0)

after downloading the suitable binary file, set the path variable for the binary like so:

**For macOs and Linux**
```bash
PATH="/path/to the downloaded/binary/file:$PATH"
```

or 

if your have node js installed then use:

```bash
npm install -g @darthcucumber/eyes-on
```

# 💻Usage

### Commands and Flags

![enter image description here](https://i.ibb.co/7GNy9vq/Screenshot-2020-12-14-021328.jpg)

### Examples

- **Watching over single file**

```bash
eyeson watch file1.txt
```
watches over `file1.txt`

- **Watching over multiple files**

```bash
eyeson watch file1.txt file2.txt file3.txt
```
watches over the file name provided as agrs.
**note:** if any of the file provided as agrs does not exists then it stops watching and exits.

- **Watching over all the files in current directory**

```bash
eyeson watch *
```
gives following result:
![enter image description here](https://i.ibb.co/DfBnJsp/h-Hr-Cx-Vav-Jc.gif)

- **Watching over specific files in current directory**

```bash
eyeson watch *.js
```
only  watches  for all `js` files in the directory
gives following result:
![enter image description here](https://i.ibb.co/dmrcCKM/xg-G2qy-Tb-Av.gif)

- **Changing watch interval time**

```bash
eyeson watch *.js -t=1000
```
this changes the interval to 1000ms (1s) i.e the interval at which **eyeson** checks for file modification. Takes input in milliseconds. Default is 2s or 2000ms.

- **Passing single line commands**

```bash
eyeson watch test.py -c="python3 test.py"
```
this executes `python3 test.py` (runs the python file test.py) command on any modification in the files its watching over.
gives following result:

![enter image description here](https://i.ibb.co/Qmx4Vnc/y7-Owwy-Jb3m.gif)

- **Passing multiple line commands**

```bash
eyeson watch test.cpp -c="g++ -o test test.cpp
./test"
```
this executes `g++ -o test test.cpp` (compiles test.cpp)  first and then executes `./test` (runs the cpp program) on any modification in the files its watching over. This feature comes in very handy.

gives following result:

![enter image description here](https://i.ibb.co/3mYtSDQ/Ra160-PGf-Bv.gif)
