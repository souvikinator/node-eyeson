<pre>
█▀▀ █▄█ █▀▀ █▀ █▀█ █▄░█
██▄ ░█░ ██▄ ▄█ █▄█ █░▀█
</pre>

**Eyes-on** is a minimal Cross-platform command line file watcher which lets user watch for modification/deletion over single/multiple files.


# 📃Features/Todos

- [x]  Watches for *modification* and *deletion* in files
- [x]  Users can change the checking interval of `eyeson` based on their needs
- [x]  Users can pass command to execute which triggers when any file in watch list is *modified*.

# 🔧Installation

The repo already includes the bianary of **eyeson** in the **binaries folder**

- eyeson-linux (for linux)
- eyeson-macos (for macos)
- eyeson-win.exe (for windows)

after downloading the suitable binary file, set the path variable for the binary like so:

**For macOs and Linux**
```bash
PATH="/path/to the downloaded/binary/file:$PATH"
```

# 💻Usage

### Commands and Flags

~image here~

### Examples

- **Watching over single file**

```bash
eyeson watch file1.txt
```
gives following result:
~gif here~

- **Watching over multiple files**

```bash
eyeson watch file1.txt file2.txt file3.txt
```
gives following result:
~gif here~

- **Watching over all the files in current directory**

```bash
eyeson watch *
```
gives following result:
~gif here~

- **Watching over specific files in current directory**

```bash
eyeson watch *.js
```
only  watches  `js` files
gives following result:
~gif here~

- **Changing watch interval time**

```bash
eyeson watch *.js -t=1000
```
gives following result:
~gif here~

- **Passing single line commands**

```bash
eyeson watch *.txt -c="cat *.txt"
```
this executes `cat *.txt` (echos content of all txt file in the directory) command on any modification in the files its watching over.
gives following result:
~gif here~

- **Passing multiple line commands**

```bash
eyeson watch test.cpp -c="gcc -o test test.cpp
./test"
```
this executes `gcc -o test test.cpp` (compiles test.cpp)  first and then executes `./test` (runs the cpp program) on any modification in the files its watching over. This feature comes in very handy.

gives following result:
~gif here~

## Notes

Q) what if there is some error in the executable file you tried to execute by passing command to eyeson?

show example....
