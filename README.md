# Obsidian Canvas Thumbnails (In Development)

Like what I do? Check out my other creative endeavors here: https://abyssalsoda.carrd.co/

This project uses Typescript and depends on the latest plugin API (obsidian.d.ts) in Typescript Definition format, which contains TSDoc comments describing what it does.

**Note:** Plugin is in early development, currently only .clip files are supported and customization is limited. Let me know if there are other formats you wish to see support.

This plugin aims to:
- Add support for .blend files
- Add support for .psd files
- Allow users to choose between file types to add to obsidian vault vs simple links
- Allow users to customize their own thumbnail if they don't like the default ones provided by the native files
- Allow custom scale for viewing different file types .blend .clip .pdf .psd so forth

## Known Issues & Limitations

Couple of bugs I need to squash and features to fix:

- Zooming out causes thumbnails to disappear (Native Canvas behavior set to change)
- Thumbnails can occasionally not be recognized
- Deleting files in canvas does not delete them from your obsidian vault

Limitations to be aware of:

- Requires you to have Clip Studio Paint thumbnails enabled, you can access this when opening CSP and going to "help" at the top of your toolbar, then clicking "file associations". This should prompt you with a native CSP executible to embed .clip files with thumbnails.
- Clip Studio Paint depriciated certain paths used to store thumbnails, if you have a Celsys folder in your Documents, this plugin might not work for your older version of CSP. Versions 1.5 and above: https://www.reddit.com/r/ClipStudio/comments/v743p5/no_celsys_folder_in_documents/

## Canvas Thumbnails Behavior

![]([https://github.com/AbyssalSoda/Canvas-File-Thumbnails/blob/CT.gif])

## Native Obsidian Behavior

![](https://github.com/AbyssalSoda/Canvas-File-Thumbnails/blob/master/NCT.gif)

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`


## How to use

- Download plugin from the latest releases tab
- Activate in Obsidian Settings
- Drag and Drop file of choice

## Important Notes & Limitations

- If a file lacks a native thumbnail no thumbnail will display in Obsidian Canvas, you must first open the project in Clip Studio or Blender in order to generate the thumbnail if your cache had been cleared or temp file since expired

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
    "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
    "fundingUrl": {
        "Buy Me a Coffee": "https://buymeacoffee.com",
        "GitHub Sponsor": "https://github.com/sponsors",
        "Patreon": "https://www.patreon.com/"
    }
}
```

## API Documentation

See https://github.com/obsidianmd/obsidian-api
