import axios from 'axios';
import childProcess from 'child_process';
import fs from 'fs';
import orvalConfig from '../orval.config.ts';

async function build() {
  const config = orvalConfig['agends-file'];
  try {
    const { data: yaml } = await axios.get(`${config.output.baseUrl}/doc`);

    fs.createWriteStream(config.input).write(yaml);
  } catch (error) {
    console.log(error);
    return;
  }
  childProcess.exec(
    'pnpm orval --config orval.config.ts',
    (exception, stdout, stderr) => {
      if (exception) console.log(exception);

      console.log(stdout);

      console.log(stderr);
    },
  );
}
build();
