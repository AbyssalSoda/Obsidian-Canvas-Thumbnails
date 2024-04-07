# Obsidian Canvas Thumbnails (In Development)

**Like what I do?** Check out my other creative endeavors here: https://abyssalsoda.carrd.co/

This plugin aims to allow Obsidian Canvas users to easily visualize and keep track of their files for writing and art projects. 

**Note:** Plugin is in early development, currently only .clip files are supported and customization is limited. Let me know if there are other formats you wish to see support.

## Installation

Current Method:
- Install it using [BRAT](https://github.com/TfTHacker/obsidian42-brat) Go to the Community Plugins tab in the settings and search for "BRAT" & copy-paste the repository link for Canvas Thumbnails.

Pending Approval:
- Community Plugins tab in the settings and search for "Canvas Thumbnails" (Currently unavailable) 


## Canvas Thumbnails Behavior

![](https://github.com/AbyssalSoda/Canvas-File-Thumbnails/blob/master/CT.gif)

**Current Functionality**
- Easy drag and drop
- Deletes files from vault when deleting in canvas (setting)

**Planned Support:** 
- Add support for .blend files
- Add support for .psd files
- Add support for .obj .fbx .stl files
- Automatically resize node to fit thumbnail
- Allow users to choose between file types to add to obsidian vault vs simple links
- Allow users to customize their own thumbnail if they don't like the default ones provided by the native files
- Allow custom scale for viewing different file types .blend .clip .pdf .psd so forth


## Native Obsidian Behavior

![](https://github.com/AbyssalSoda/Canvas-File-Thumbnails/blob/master/NCT.gif)

**Current Functionality**
- No thumbnail
- Bloated Files - Doesn't delete files in vault when deleting from canvas
- Sad :(


## How to use

- Download plugin from the latest releases tab
- Activate in Obsidian Settings
- Drag and Drop file of choice


## Known Issues & Limitations

Couple of bugs I need to squash and features to fix:

- Zooming out causes thumbnails to disappear (Native Canvas behavior set to change)
  
- Deleting files in canvas does not delete them from your obsidian vault

**Limitations**

- Has thus far only been tested on Windows but should have compatibility for andriod devices for .clip files

- Requires you to have Clip Studio Paint thumbnails enabled, you can access this when opening CSP and going to "help" at the top of your toolbar, then clicking "file associations". This should prompt you with a native CSP executible to embed .clip files with thumbnails.

-  Clip Studio Paint [depriciated certain paths](https://www.reddit.com/r/ClipStudio/comments/v743p5/no_celsys_folder_in_documents/) used to store thumbnails, if you have a Celsys folder in your Documents, this plugin might not work for your older version of CSP. Versions 1.5 and above.
  
- Unfortunately Obsidian does not provide a public API for plugins to access canvas object forcing the use of DOM listeners to achieve the goal - this can be potentially taxing if you have an obsurdly large number of files.
