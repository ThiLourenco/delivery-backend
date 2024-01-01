import { Request } from 'express'
import multer, { Multer } from 'multer'
import crypto from 'crypto'
import { join } from 'path'

const tmpFolder = join(__dirname, '..', '..', 'tmp')

const storage: multer.StorageEngine = multer.diskStorage({
  destination: tmpFolder,
  filename: (request, file, callback) => {
    const fileHash = crypto.randomBytes(16).toString('hex')
    const fileName = `${fileHash}-${file.originalname}`

    return callback(null, fileName)
  },
})

const fileFilter = (
  request: Request,
  // eslint-disable-next-line no-undef
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png']

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    console.log('Only jpg, jpeg & png files are allowed')
    callback(null, false)
  }
}

const limits: multer.Options['limits'] = {
  fileSize: 3 * 1024 * 1024, // 3 MB
}

const upload: Multer = multer({ storage, fileFilter, limits })

export { tmpFolder, upload }
