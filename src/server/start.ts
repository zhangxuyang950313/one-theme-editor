import { serverFile } from "src/main/constant";
import pm2 from "pm2";

pm2.connect(err => {
  if (err) {
    console.error(11, err);
    process.exit(2);
  }

  pm2.start(
    {
      script: serverFile,
      name: "one-server"
    },
    (err, apps) => {
      if (err) {
        console.error(err);
        return pm2.disconnect();
      }
      pm2.list((err, list) => {
        console.log(22, err, list);
      });
    }
  );
});
