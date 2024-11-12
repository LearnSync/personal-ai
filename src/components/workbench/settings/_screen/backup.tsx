import { H3 } from "../_components";

export const BackupSettingScreen = () => {
  return (
    <section>
      <div>
        <H3>Backup</H3>
        <div>
          <h5>Backup With Google Drive</h5>
        </div>
        <div>
          <h5>Backup With iCloud</h5>
        </div>
        <div>
          <h5>Backup With One Drive</h5>
        </div>
        <div>
          <h5>Backup With Mega Cloud</h5>
        </div>
        <div>
          <h5>Backup With Dropbox</h5>
        </div>
      </div>
      <div className="mt-6">
        <H3>Custom Backup</H3>
        <div>
          <h5>Backup With AWS(S3)</h5>
        </div>
        <div>
          <h5>Backup With Cloudinary</h5>
        </div>
      </div>
    </section>
  );
};

export default BackupSettingScreen;
