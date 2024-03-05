import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import crypto from 'crypto';
import multer from 'multer';
import {promisify} from 'util';
import {FileDetails} from '../dtos/file.dto';
// import {saveImageToDb} from '../repositories/images.repository';
import {ResponseDTO} from '../utils/common.dtos';
import {createResponseObject} from '../utils/common.service';
const getImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export async function storeNewImage(file: FileDetails): Promise<ResponseDTO> {
  // put the object in S3
  const aws_access_key: any = process.env.AWS_ACCESS_KEY;
  const aws_secret_key: any = process.env.AWS_SECRET_KEY;
  const aws_region: any = process.env.AWS_REGION;
  const bucket_name: any = process.env.BUCKET_NAME;

  const S3 = new S3Client({
    credentials: {
      accessKeyId: aws_access_key,
      secretAccessKey: aws_secret_key,
    },
    region: aws_region,
  });
  const imageName = getImageName();
  /* const buffer = sharp(file.buffer)
    .resize({height: 1920, width: 1080, fit: 'contain'})
    .toBuffer(); */
  const params = {
    Body: file.buffer,
    Key: imageName,
    Bucket: bucket_name,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  const data = await S3.send(command);
  if (data.$metadata.httpStatusCode !== 200) {
    return await createResponseObject(
      'Error in uploading the image',
      data.$metadata.httpStatusCode,
      true,
      '',
      null,
    );
  }
  return await createResponseObject(
    '',
    data.$metadata.httpStatusCode,
    false,
    'Image uploaded successfully',
    {...data, imageName},
  );
  // const obj = {imagename: imageName, originalName: file.originalname};
  // return await makeEntryinDB(obj);
}
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
export const uploadFileAsync = promisify(upload.single('file'));

/* async function makeEntryinDB(imageToDb: ImageToDb): Promise<ResponseDTO> {
  try {
    const createdImageResponseDb = await saveImageToDb(imageToDb);
    if (createdImageResponseDb) {
      return createResponseObject('', 201, false, '', createdImageResponseDb);
    }
    return createResponseObject(
      'unable to save image details',
      404,
      true,
      '',
      null,
    );
  } catch (error) {
    console.log('Failed creating the image entry in DB');
    return createResponseObject(error, 500, true, '', null);
  }
} */
