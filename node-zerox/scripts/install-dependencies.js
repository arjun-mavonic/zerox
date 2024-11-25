const { exec } = require("child_process");
const { promisify } = require("util");

const execPromise = promisify(exec);

const installPackage = async (command, packageName) => {
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      throw new Error(`Failed to install ${packageName}: ${stderr}`);
    }
    return stdout;
  } catch (error) {
    throw new Error(`Failed to install ${packageName}: ${error.message}`);
  }
};

const isSudoAvailable = async () => {
  try {
    // Try running a sudo command
    await execPromise("sudo -n true");
    return true;
  } catch {
    return false;
  }
};

const isAlpine = async () => {
  try {
    const { stdout } = await execPromise("cat /etc/os-release");
    return stdout.includes("alpine");
  } catch {
    return false;
  }
};

const checkAndInstall = async () => {
  try {
    const sudoAvailable = await isSudoAvailable();
    const alpine = await isAlpine();

    // Function to determine the appropriate install command
    const installCommand = (pkg) =>
      alpine
        ? `apk add --no-cache ${pkg}`
        : sudoAvailable
        ? `sudo apt-get update && sudo apt-get install -y ${pkg}`
        : `apt-get update && apt-get install -y ${pkg}`;

    // Check and install Ghostscript
    try {
      await execPromise("gs --version");
    } catch {
      if (process.platform === "darwin") {
        await installPackage("brew install ghostscript", "Ghostscript");
      } else {
        const command = alpine
          ? "apk add --no-cache ghostscript"
          : installCommand("ghostscript");
        await installPackage(command, "Ghostscript");
      }
    }

    // Check and install GraphicsMagick
    try {
      await execPromise("gm -version");
    } catch {
      if (process.platform === "darwin") {
        await installPackage("brew install graphicsmagick", "GraphicsMagick");
      } else {
        const command = alpine
          ? "apk add --no-cache graphicsmagick"
          : installCommand("graphicsmagick");
        await installPackage(command, "GraphicsMagick");
      }
    }

    // Check and install LibreOffice
    try {
      await execPromise("soffice --version");
    } catch {
      if (process.platform === "darwin") {
        await installPackage("brew install --cask libreoffice", "LibreOffice");
      } else {
        const command = alpine
          ? "apk add --no-cache libreoffice"
          : installCommand("libreoffice");
        await installPackage(command, "LibreOffice");
      }
    }
  } catch (err) {
    console.error(`Error during installation: ${err.message}`);
    process.exit(1);
  }
};

checkAndInstall();
