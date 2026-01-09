const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    // Get inputs
    const cmd = core.getInput('cmd', { required: true });
    const version = core.getInput('version', { required: false }) || 'latest';

    // Normalize version - remove 'v' prefix if present
    const normalizedVersion = version.startsWith('v') ? version.slice(1) : version;

    core.info(`Running command: ${cmd}`);
    core.info(`Using celq version: ${normalizedVersion}`);

    // Build npx command
    // npx -y (non-interactive) -p celq@version (specify package) -c "command" (run command)
    const npxArgs = ['-y'];
    
    if (normalizedVersion === 'latest') {
      npxArgs.push('-p', 'celq');
    } else {
      npxArgs.push('-p', `celq@${normalizedVersion}`);
    }
    
    npxArgs.push('-c', cmd);

    // Capture output
    let output = '';
    let errorOutput = '';

    const options = {
      listeners: {
        stdout: (data) => {
          output += data.toString();
        },
        stderr: (data) => {
          errorOutput += data.toString();
        }
      },
      ignoreReturnCode: false
    };

    // Execute the command
    await exec.exec('npx', npxArgs, options);

    // Trim the output
    const result = output.trim();

    // Set the output
    core.setOutput('result', result);
    
    core.info('Command executed successfully');
    if (result) {
      core.info(`Result: ${result}`);
    }

  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();