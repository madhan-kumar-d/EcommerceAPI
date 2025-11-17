// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, Router } from 'express';
import { isAdmin, validateToken } from '../middleware/auth.js';
import { errorHandler } from '../errorHandler.js';
import multer from 'multer';
import {
  createProduct,
  deleteProduct,
  getProducts,
  searchProducts,
  updateProduct,
} from '../controllers/product.js';
import { getValidator, validator } from '../middleware/validator.js';
import {
  createProductSchema,
  queryProductSchema,
  searchSchema,
} from '../validator.Schema/products.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/products');
  },
  filename: function (req, file, cb) {
    const newFileName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      // path.basename(file.originalname)
      // +'.' + path.extname(file.originalname)
      file.originalname;
    cb(null, newFileName);
  },
});
const uploads = multer({ storage: storage });

const productRoute = Router();
productRoute.get(
  '/:productID',
  [errorHandler(validateToken), getValidator(queryProductSchema)],
  errorHandler(getProducts),
);
productRoute.post(
  '/',
  uploads.single('profileImage'),
  [
    errorHandler(validateToken),
    errorHandler(isAdmin),
    validator(createProductSchema),
  ],
  errorHandler(createProduct),
);
productRoute.put(
  '/:productID',
  uploads.single('profileImage'),
  [
    errorHandler(validateToken),
    errorHandler(isAdmin),
    validator(createProductSchema),
    getValidator(queryProductSchema),
  ],
  errorHandler(updateProduct),
);
productRoute.delete(
  '/:productID',
  [
    errorHandler(validateToken),
    errorHandler(isAdmin),
    getValidator(queryProductSchema),
  ],
  errorHandler(deleteProduct),
);

productRoute.post(
  '/search',
  [errorHandler(validateToken), validator(searchSchema)],
  searchProducts,
);

export default productRoute;
