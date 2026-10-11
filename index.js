console.log('#59. JavaScript homework example file');

import { createReadStream, createWriteStream } from 'node:fs';
import { access, constants as fsConstants } from 'node:fs/promises';
import { createGzip, createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

async function fileExists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function getUniqueFilePath(desiredPath) {
  if (!(await fileExists(desiredPath))) {
    return desiredPath;
  }

  const dir = path.dirname(desiredPath);
  const ext = path.extname(desiredPath);
  const base = path.basename(desiredPath, ext);

  let counter = 1;
  let candidate;
  do {
    candidate = path.join(dir, `${base} (${counter})${ext}`);
    counter += 1;
  } while (await fileExists(candidate));

  return candidate;
}

/*
 *
 * #1
 *
 * Технічне завдання для розробки функції "compressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, що використовує алгоритм Gzip для компресії заданого файлу.
 * Функція має генерувати унікальне ім'я для компресованого файлу, якщо файл з таким іменем вже існує,
 * та забезпечувати високий рівень надійності та безпеки процесу компресії.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *    - `filePath`: Шлях до файлу, який потрібно компресувати.
 *
 * 2. Вихідні дані:
 *    - Функція повертає шлях до компресованого файлу як рядок.
 *
 * 3. Унікальність:
 *    - Перевірка наявності існуючих файлів з таким самим іменем і створення унікального імені файлу
 *      шляхом додавання номера до існуючого імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *    - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *    - В разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *      що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM
 *   для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми
 *   або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути сгенеровані,
 *   та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою JEST.
 *
 */

async function compressFile(filePath) {
  if (typeof filePath !== 'string' || filePath.length === 0) {
    throw new TypeError('compressFile: "filePath" must be a non-empty string');
  }

  if (!(await fileExists(filePath))) {
    throw new Error(`compressFile: source file not found: ${filePath}`);
  }

  const outputPath = await getUniqueFilePath(`${filePath}.gz`);

  try {
    await pipeline(
      createReadStream(filePath),
      createGzip(),
      createWriteStream(outputPath),
    );
  } catch (error) {
    throw new Error(`compressFile: failed to compress "${filePath}": ${error.message}`);
  }

  return outputPath;
}

/*
 *
 * #2
 *
 * Технічне завдання для розробки функції "decompressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, яка використовує алгоритм Gzip для розпакування заданого компресованого файлу у вказане місце збереження. Функція має генерувати унікальне ім'я для розпакованого файлу, якщо файл з таким іменем вже існує, та забезпечувати високий рівень надійності та безпеки процесу розпакування.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - `compressedFilePath`: Шлях до компресованого файлу, який потрібно розпакувати.
 *  - `destinationFilePath`: Шлях, де буде збережено розпакований файл.
 *
 * 2. Вихідні дані:
 *  - Функція повертає шлях до розпакованого файлу як рядок.
 *
 * 3. Унікальність:
 *  - Перевірка наявності існуючих файлів з таким самим іменем і створення унікального імені файлу шляхом додавання номера до існуючого імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *  - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *  - В разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *    що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути сгенеровані, та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою JEST.
 *
 */

async function decompressFile(compressedFilePath, destinationFilePath) {
  if (typeof compressedFilePath !== 'string' || compressedFilePath.length === 0) {
    throw new TypeError('decompressFile: "compressedFilePath" must be a non-empty string');
  }
  if (typeof destinationFilePath !== 'string' || destinationFilePath.length === 0) {
    throw new TypeError('decompressFile: "destinationFilePath" must be a non-empty string');
  }

  if (!(await fileExists(compressedFilePath))) {
    throw new Error(`decompressFile: compressed file not found: ${compressedFilePath}`);
  }

  const outputPath = await getUniqueFilePath(destinationFilePath);

  try {
    await pipeline(
      createReadStream(compressedFilePath),
      createGunzip(),
      createWriteStream(outputPath),
    );
  } catch (error) {
    throw new Error(`decompressFile: failed to decompress "${compressedFilePath}": ${error.message}`);
  }

  return outputPath;
}

async function performCompressionAndDecompression() {
  try {
    const compressedResult = await compressFile('./files/source.txt')
    console.log(compressedResult)
    const decompressedResult = await decompressFile(compressedResult, './files/source_decompressed.txt')
    console.log(decompressedResult)
  } catch (error) {
    console.error('Error during compression or decompression:', error)
  }
}

void performCompressionAndDecompression()

export { compressFile, decompressFile };