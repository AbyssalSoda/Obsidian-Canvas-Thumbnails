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
            console.log("Mutation observed"); // Log when a mutation is observed
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log("ChildList mutation detected"); // Log specifics of the mutation
    
                    // Handling added nodes
                    mutation.addedNodes.forEach(async (node) => {
                        console.log("Node added"); // Log when a node is added
                        if (!(node instanceof HTMLElement)) return;
                        const canvasNodeContent = node.querySelector('.canvas-node-content');
                        if (canvasNodeContent && canvasNodeContent.querySelector('.file-embed-title')?.textContent?.trim().endsWith('.clip')) {
                            const title = canvasNodeContent.querySelector('.file-embed-title')?.textContent?.trim() ?? null;
                            console.log('Canvas node content added with title:', title); // Log the title of the added content
                            this.updateCanvasWithThumbnail(canvasNodeContent, title);
                        }
                    });
    
                    // Handling removed nodes
                    mutation.removedNodes.forEach(async (node) => {
                        console.log("Node removed"); // Log when a node is removed
                        if (!(node instanceof HTMLElement)) return;
    
                        // Direct removal of .canvas-node-container
                        if (node.matches('.canvas-node-container')) {
                            console.log(".canvas-node-container directly removed"); // Log direct removal
                            this.handlePotentialNodeRemoval(node);
                        }
    
                        // Check within removed nodes for .canvas-node-container
                        node.querySelectorAll('.canvas-node-container').forEach(childNode => {
                            console.log(".canvas-node-container found in removed node"); // Log found container in removed node
                            this.handlePotentialNodeRemoval(childNode);
                        });
                    });
                }
            }
        };
    
        new MutationObserver(callback).observe(canvasContainer, config);
        console.log("MutationObserver initialized"); // Log the initialization of the MutationObserver
    }
    
    private handlePotentialNodeRemoval(node: Element) {
        const fileNameWithoutExtension = node.getAttribute('data-filename');
    
        if (fileNameWithoutExtension) {
            // Deleting the thumbnail
            const thumbnailPath = `thumbnails/${fileNameWithoutExtension}.png`;
            console.log(`Deleting thumbnail for: ${fileNameWithoutExtension} at path: ${thumbnailPath}`);
            this.deleteFile(thumbnailPath); // Reuse the delete logic for both thumbnail and .clip file
    
            // Deleting the .clip file
            const clipFilePath = `${fileNameWithoutExtension}.clip`;
            console.log(`Deleting .clip file for: ${fileNameWithoutExtension} at path: ${clipFilePath}`);
            this.deleteFile(clipFilePath); // Assuming the .clip file is in the root of the vault
        } else {
            console.log("No filename associated with the removed container.");
        }
    }
    
    private async deleteFile(filePath: string) {
        console.log(`Attempting to delete file at: ${filePath}`);
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
            try {
                await this.app.vault.delete(file);
                console.log(`File successfully deleted: ${filePath}`);
            } catch (error) {
                console.error(`Failed to delete file ${filePath}:`, error);
            }
        } else {
            console.log(`File not found for deletion: ${filePath}`);
        }
    }
    
    
    
    private async deleteThumbnail(thumbnailsPath: string) {
        console.log(`Attempting to delete thumbnail at: ${thumbnailsPath}`);
        const file = this.app.vault.getAbstractFileByPath(thumbnailsPath);
        if (file instanceof TFile) {
            try {
                await this.app.vault.delete(file);
                console.log(`Thumbnail successfully deleted: ${thumbnailsPath}`);
            } catch (error) {
                console.error(`Failed to delete thumbnail ${thumbnailsPath}:`, error);
            }
        } else {
            console.log(`Thumbnail file not found for deletion: ${thumbnailsPath}`);
        }
    }
    
    
    private async updateCanvasWithThumbnail(canvasNodeContent: Element, title: string | null) {
        if (!title) return;
        const fileNameWithoutExtension = title.replace('.clip', '');
        const thumbnailsPath = `thumbnails/${fileNameWithoutExtension}.png`;
    
        const container = canvasNodeContent.closest('.canvas-node-container');
        if (container) {
            console.log("Setting data-filename on:", container); 
            container.setAttribute('data-filename', fileNameWithoutExtension);
        }
    
        const file = await this.waitForFile(thumbnailsPath, 5, 1000);
        if (file instanceof TFile) {
            const resourcePath = this.app.vault.getResourcePath(file);
            canvasNodeContent.innerHTML = `<img src="${resourcePath}" alt="${fileNameWithoutExtension}" style="max-width: 100%; max-height: 100%;">`;
        } else {
            console.error(`Thumbnail file not found for: ${fileNameWithoutExtension} at path: ${thumbnailsPath}`);
        }
    }
    
    
    private async waitForFile(path: string, retries: number, interval: number): Promise<TAbstractFile | null> {
        for (let i = 0; i < retries; i++) {
            const file = this.app.vault.getAbstractFileByPath(path);
            if (file) return file;
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        return null;
    }
    

    async handleFileDrop(evt: DragEvent) {
        evt.preventDefault();
        if (!evt.dataTransfer) return;
        
        const items = Array.from(evt.dataTransfer.items);
        for (const item of items) {
            if (item.kind !== 'file') continue;
            const file = item.getAsFile();
            if (!file || !file.name.endsWith('.clip')) continue;
            
            try {
                console.log(`Processing file: ${file.name}`);
                const fileNameWithoutExtension = file.name.replace('.clip', '');
                await this.processClipFile(fileNameWithoutExtension);
            } catch (error) {
                console.error(`Failed to process file ${file?.name}:`, error);
            }
        }
    }
    
    async processClipFile(fileNameWithoutExtension: string) {
        // Renamed to MainSearchDirectory for primary search
        const MainSearchDirectory = path.join(os.homedir(), 'AppData', 'Roaming', 'CELSYSUserData', 'CELSYS', 'CLIPStudioCommon', 'Document');
        //console.log(`Searching in Main directory: ${MainSearchDirectory}`);
        const foundInMain = await this.findCatalogXml(MainSearchDirectory, fileNameWithoutExtension);
    
        // Renamed to SubSearchDirectory and only search here if not found in MainSearchDirectory
        if (!foundInMain) {
            const SubSearchDirectory = path.join(os.homedir(), 'Documents', 'CELSYS', 'CLIPStudioCommon', 'Document');
            //console.log(`Searching in Sub directory: ${SubSearchDirectory}`);
            await this.findCatalogXml(SubSearchDirectory, fileNameWithoutExtension);
        }
    }
    
    async findCatalogXml(directory: string, targetFileNameWithoutExtension: string): Promise<boolean> {
        //console.log(`Searching in directory: ${directory} for ${targetFileNameWithoutExtension}`);
        let filesAndDirs;
        try {
            filesAndDirs = await fs.readdir(directory, { withFileTypes: true });
        } catch (err) {
            console.error('Error reading directory:', err);
            return false;
        }
    
        for (const dirent of filesAndDirs) {
            if (dirent.isDirectory()) {
                const found = await this.findCatalogXml(path.join(directory, dirent.name), targetFileNameWithoutExtension);
                if (found) return true;
            } else if (dirent.name === 'catalog.xml') {
                const found = await this.parseXmlFile(path.join(directory, dirent.name), targetFileNameWithoutExtension);
                if (found) return true;
            }
        }
        return false;
    }

    async parseXmlFile(xmlFilePath: string, targetFileNameWithoutExtension: string): Promise<boolean> {
        //console.log(`Parsing XML file: ${xmlFilePath}`);
        let xml;
        try {
            xml = await fs.readFile(xmlFilePath, 'utf8');
        } catch (err) {
            console.error('Error reading XML file:', err);
            return false; // Return false if there's an error reading the file
        }
    
        try {
            const result = await xml2js.parseStringPromise(xml); // Use parseStringPromise for promise-based parsing
            const projectName = result.archive.catalog[0].name[0];
            //console.log(`Parsed project name: ${projectName} for target: ${targetFileNameWithoutExtension}`);
    
            if (projectName === targetFileNameWithoutExtension) {
                console.log(`Project name matches target. Preparing to copy thumbnail for ${projectName}`);
                const originalThumbnailPath = path.join(path.dirname(xmlFilePath), 'thumbnail', 'thumbnail.png');
                console.log(`Thumbnail path determined as: ${originalThumbnailPath}`);
                await this.copyThumbnailToVault(originalThumbnailPath, projectName);
                return true; // Return true if the project name matches the target
            } else {
                console.log(`Project name does not match target. Skipping ${projectName}`);
                return false; // Return false if the project name does not match the target
            }
        } catch (err) {
            console.error('Error parsing XML:', err);
            return false; // Return false if there's an error parsing the XML
        }
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
                // Check if the error message includes "already exists" to avoid logging those errors
                if (!err.message.includes('already exists')) {
                    console.error('Error creating folder:', err);
                }
                // Optionally, handle the "already exists" case silently or perform other actions as needed
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
