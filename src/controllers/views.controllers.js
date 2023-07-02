import { getProducts, findById } from "../services/products.services.js";
import {
  addCartService,
  addProductToCartService,
} from "../services/carts.services.js";

export const getHome = async (req, res) => {
  if (req.user) {
    res.redirect("products");
  } else {
    res.render("login", { title: "Inicia session para ver los productos" });
  }
};

export const getRegister = (req, res) => {
  res.render("register", { title: "pagina" });
};

export const getProductsControllers = async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const products = await getProducts({ limit, page, sort, query });

    if (req.user && req.user.email) {
      const plainProducts = products.docs.map((product) => product);
      res.render("products", {
        ...products,
        docs: plainProducts,
        userEmail: req.user.email,
      });
    } else {
      res
        .status(440)
        .send("error440", { status: "440", message: "SessionExpirada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Se produjo un error en el servidor");
  }
};

export const getProductByIdControllers = async (req, res) => {
  const product = await findById(req.params.id);

  const { _id, title, description, price, code, stock, category, image } =
    product;

  res.render("productDetail", {
    id: _id,
    title,
    description,
    price,
    code,
    stock,
    category,
    image,
  });
};

export const addProductToCartControllers = async (req, res) => {
  try {
    const { pid } = req.params;
    const quantity = req.query.quantity;

    // Si no existe un carrito en la sesión actual, lo creamos
    if (!req.session.cartId) {
      const newCart = await addCartService();

      // Si no se pudo crear el carrito, se lanza un error
      if (!newCart) {
        return res.status(500).send({ status: "error", error: "No se pudo crear el carrito" });
      }

      // Si se crea correctamente el carrito, guardamos el ID en la sesión
      req.session.cartId = newCart._id;
      
    }
    let cartId = req.session.cartId.toString();
    // Una vez asegurada la existencia del carrito, añadimos el producto
    const cart = await addProductToCartService(cartId, pid, quantity);

    // Si se pudo agregar el producto al carrito, respondemos con éxito
    if (cart) {
      res.status(201).send({ status: "success", payload: cart });
    } else {
      // Si no se pudo agregar el producto al carrito, respondemos con error
      res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
    }
  } catch (err) {
    // Si ocurrió algún error durante el proceso, respondemos con un error general
    console.error(err);
    res.status(500).send({
      status: "error",
      error: "Error al agregar el producto al carrito",
    });
  }
};

