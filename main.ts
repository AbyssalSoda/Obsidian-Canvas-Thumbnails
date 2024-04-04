import { Notice, Plugin, TAbstractFile, TFolder, TFile, FileSystemAdapter } from 'obsidian';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import * as os from 'os';

interface ClipStudioThumbnailViewerSettings {
    thumbnailsDirectory: string;
}

const DEFAULT_SETTINGS: ClipStudioThumbnailViewerSettings = {
    thumbnailsDirectory: 'thumbnails'
};

export default class ClipStudioThumbnailViewer extends Plugin {
    settings: ClipStudioThumbnailViewerSettings;

    async onload() {
        await this.loadSettings();
        await this.ensureDirectoryExists(this.settings.thumbnailsDirectory);
        this.registerDomEvent(document, 'drop', (evt: DragEvent) => this.handleFileDrop(evt));
        this.observeCanvasChanges();
    }

    private observeCanvasChanges() {
        const canvasContainer = document.body;
        const config = { childList: true, subtree: true };
    
        const callback = (mutationsList: MutationRecord[], observer: MutationObserver) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(async (node) => {
                        if (!(node instanceof HTMLElement)) return;
                        const canvasNodeContent = node.querySelector('.canvas-node-content');
                        if (canvasNodeContent && canvasNodeContent.querySelector('.file-embed-title')?.textContent?.trim().endsWith('.clip')) {
                            // Using ?? to return null if the value is undefined
                            const title = canvasNodeContent.querySelector('.file-embed-title')?.textContent?.trim() ?? null;
                            console.log('Canvas node content added:', canvasNodeContent);
                            this.updateCanvasWithThumbnail(canvasNodeContent, title);
                        }
                    });
                }
            }
        };
    
        new MutationObserver(callback).observe(canvasContainer, config);
    }
    

    private async updateCanvasWithThumbnail(canvasNodeContent: Element, title: string | null) {
        if (!title) return;
        const fileNameWithoutExtension = title.replace('.clip', '');
        console.log(`Attempting to update canvas for: ${fileNameWithoutExtension}`);
    
        const thumbnailsPath = `thumbnails/${fileNameWithoutExtension}.png`;
        console.log(`Looking for thumbnail at path: ${thumbnailsPath}`);
    
        const file = this.app.vault.getAbstractFileByPath(thumbnailsPath);
    
        if (file instanceof TFile) {
            console.log(`File found: ${file.path}`);
            const resourcePath = this.app.vault.getResourcePath(file);
            console.log(`Using resource path: ${resourcePath}`);
            canvasNodeContent.innerHTML = `<img src="${resourcePath}" alt="${fileNameWithoutExtension}" style="max-width: 100%; max-height: 100%;">`;
        } else {
            console.error(`Thumbnail file not found for: ${fileNameWithoutExtension} at path: ${thumbnailsPath}`);
        }
    }
    
    

    async handleFileDrop(evt: DragEvent) {
        if (!evt.ctrlKey || !evt.dataTransfer) return;
        evt.preventDefault();
        const items = Array.from(evt.dataTransfer.items).filter(item => item.kind === 'file' && item.getAsFile()?.name.endsWith('.clip'));

        for (const item of items) {
            const file = item.getAsFile();
            console.log(`Processing .clip file: ${file?.name}`);
            new Notice(`Processing .clip file: ${file?.name}`);
            if (file) {
                const fileNameWithoutExtension = file.name.replace('.clip', '');
                await this.processClipFile(fileNameWithoutExtension);
            }
        }
    }

    async processClipFile(fileNameWithoutExtension: string) {
        const searchDirectory = path.join(os.homedir(), 'Documents', 'CELSYS', 'CLIPStudioCommon', 'Document');
        console.log(`Searching in directory: ${searchDirectory}`);
        await this.findCatalogXml(searchDirectory, fileNameWithoutExtension);
    }

    async findCatalogXml(directory: string, targetFileNameWithoutExtension: string) {
        let filesAndDirs;
        try {
            filesAndDirs = await fs.readdir(directory, { withFileTypes: true });
        } catch (err) {
            console.error('Error reading directory:', err);
            return;
        }

        for (const dirent of filesAndDirs) {
            if (dirent.isDirectory()) {
                await this.findCatalogXml(path.join(directory, dirent.name), targetFileNameWithoutExtension);
            } else if (dirent.name === 'catalog.xml') {
                await this.parseXmlFile(path.join(directory, dirent.name), targetFileNameWithoutExtension);
            }
        }
    }

    async parseXmlFile(xmlFilePath: string, targetFileNameWithoutExtension: string) {
        let xml;
        try {
            xml = await fs.readFile(xmlFilePath, 'utf8');
        } catch (err) {
            console.error('Error reading XML file:', err);
            return;
        }

        xml2js.parseString(xml, async (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            const projectName = result.archive.catalog[0].name[0];
            if (projectName === targetFileNameWithoutExtension) {
                console.log(`Found matching project: ${projectName}`);
                const originalThumbnailPath = path.join(path.dirname(xmlFilePath), 'thumbnail', 'thumbnail.png');
                await this.copyThumbnailToVault(originalThumbnailPath, projectName);
            }
        });
    }

    async copyThumbnailToVault(originalThumbnailPath: string, projectName: string) {
        const thumbnailFolderPath = this.settings.thumbnailsDirectory;
        const newFileName = `${projectName}.png`;
        try {
            const data = await fs.readFile(originalThumbnailPath);
            await this.ensureDirectoryExists(thumbnailFolderPath);
            await this.app.vault.createBinary(`${thumbnailFolderPath}/${newFileName}`, data);
            console.log(`Thumbnail copied to ${thumbnailFolderPath}/${newFileName}`);
        } catch (err) {
            console.error('Error handling thumbnail:', err);
        }
    }

    async ensureDirectoryExists(folderPath: string) {
        let folder = this.app.vault.getAbstractFileByPath(folderPath);
        if (!folder || !(folder instanceof TFolder)) {
            try {
                await this.app.vault.createFolder(folderPath);
            } catch (err) {
                console.error('Error creating folder:', err);
            }
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
