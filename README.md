<h1 align="center">
Obsidian Canvas Thumbnails
</h1>

<p align="center">
Elevate your Obsidian experience with customizable thumbnails for Canvas files, allowing for easier visualization and organization of writing and art projects.
</p>

<p align="center">
 <a href="https://github.com/AbyssalSoda/Obsidian-Canvas-Thumbnails/releases"><img height="30px" src="https://img.shields.io/github/downloads/AbyssalSoda/Obsidian-Canvas-Thumbnails/total?color=brightgreen" alt="Downloads"></a>
 <a href="https://github.com/AbyssalSoda/Obsidian-Canvas-Thumbnails/releases"><img height="30px" src="https://img.shields.io/github/v/release/AbyssalSoda/Obsidian-Canvas-Thumbnails?include_prereleases&color=brightgreen" alt="Current Release"></a>
 <a href="https://github.com/AbyssalSoda/Obsidian-Canvas-Thumbnails/issues"><img height="30px" src="https://img.shields.io/github/issues/AbyssalSoda/Obsidian-Canvas-Thumbnails?color=brightgreen" alt="Issues Badge"></a>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#functionality">Functionality</a> •
  <a href="#support">Support</a> •
  <a href="#faq">FAQ</a> •
  <a href="#links">Links</a>
</p>

<p align="center">
 <a href='https://ko-fi.com/I2I1TR6PC' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
</p>

---



**Like what I do?** Check out my other creative endeavors here: https://abyssalsoda.carrd.co/



**Note:** Plugin is in early development, currently only .clip files are supported and customization is limited. Let me know if there are other formats you wish to see support.

## Installation

**Current Method:**
- Install it using [BRAT](https://github.com/TfTHacker/obsidian42-brat)
  > Go to the Community Plugins tab in Obsidian settings and search for "BRAT" - install the plugin, then copy-paste the repository link for Canvas Thumbnails.

**Pending Approval:**
- Community Plugins tab in the settings and search for "Canvas Thumbnails" (Currently unavailable)


## Canvas Thumbnails Behavior
![](https://github.com/AbyssalSoda/Obsidian-Canvas-Thumbnails/blob/master/assets/CT.gif)

**Current Functionality**
- Easy drag and drop
- Deletes files from vault when deleting in canvas

**Planned Support:** 
- Add support for .blend files
- Add support for .psd .ae .ai .spp files
- Add support for .obj .fbx .stl files
- Add default thumbnails for files when previews are not available 
- Automatically resize node to fit thumbnail
- Allow users to choose between file types to add to obsidian vault vs simple links
- Allow users to customize their own thumbnail if they don't like the default ones provided by the native files
- Allow custom scale for viewing different file types .blend .clip .pdf .psd so forth

**Pondering Support:** 
- Integration for Advanced Canvas Node Shapes
- Native Custom Node Shapes

## Native Obsidian Behavior

![](https://github.com/AbyssalSoda/Canvas-File-Thumbnails/blob/master/assets/NCT.gif)

**Current Functionality**
- No thumbnail
- Bloated Files - Doesn't delete files in vault when deleting from canvas
- Sad :(


## How to use

- Follow Installation Steps
- Activate in Obsidian Settings if not activated automatically by BRAT
- Drag and Drop supported file of choice =)


## Known Issues & Limitations

Couple of bugs I need to squash and features to fix:

- Zooming out causes thumbnails to disappear (Native Canvas behavior set to change)
  
- Deleting files in canvas does not delete them from your obsidian vault

**Limitations**

- Has thus far only been tested on Windows but should have compatibility for andriod devices for .clip files

- Requires you to have Clip Studio Paint thumbnails enabled, you can access this when opening CSP and going to "help" at the top of your toolbar, then clicking "file associations". This should prompt you with a native CSP executible to embed .clip files with thumbnails.

-  Clip Studio Paint [depriciated certain paths](https://www.reddit.com/r/ClipStudio/comments/v743p5/no_celsys_folder_in_documents/) used to store thumbnails, if you have a Celsys folder in your Documents, this plugin might not work for your older version of CSP. Versions 1.5 and above.
  
- Unfortunately Obsidian does not provide a public API for plugins to access canvas object forcing the use of DOM listeners to achieve the goal - this can be potentially taxing if you have an obsurdly large number of files.
