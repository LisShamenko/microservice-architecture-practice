import { ComponentLoader } from 'adminjs';

// 
export const componentLoader = new ComponentLoader();

export const components = {
    Dashboard: componentLoader.add('Dashboard', './Dashboard'),
    // actions
    BulkDescriptionEdit: componentLoader.add('BulkDescriptionEdit', './Actions/BulkDescriptionEdit'),
    // TestModel
    TestModelEdit: componentLoader.add('TestModelEdit', './Actions/TestModelEdit'),
    // PhotoFile
    PhotoFileList: componentLoader.add('PhotoFileList', './PhotoFile/PhotoFileList'),
    PhotoFileShow: componentLoader.add('PhotoFileShow', './PhotoFile/PhotoFileShow'),
    PhotoFileEdit: componentLoader.add('PhotoFileEdit', './PhotoFile/PhotoFileEdit'),
}
