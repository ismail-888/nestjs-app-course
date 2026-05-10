import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
// import { UsersService } from 'src/users/users.service';

type ProductType = { id: number; title: string; price: number };

@Injectable()
export class ProductsService {
  // hon 3m neta3ml l users service bl product service hayda essmu i3temed 5ariji la2n manon bi nafess l folder
  // constructor(private readonly usersService: UsersService) {}

  private products: ProductType[] = [
    { id: 1, title: 'Product 1', price: 100 },
    { id: 2, title: 'Product 2', price: 200 },
    { id: 3, title: 'Product 3', price: 300 },
  ];

  /**
   * Create a new product
   */
  public createProduct(
    { title, price }: CreateProductDto,
    // hon mnesta3ml "whitelist: true" kerml ma ne5od mn l server l properties ma mne7teja
    // hon mnesta3ml "forbidNonWhitelisted: true" iza l server ba3atlna properties ma bedna yeha bta3tina error (bad request)
    // kerml ma kelshwai netkob l validation la kel request fa mnektbon bl "main.ts" bisuru gloably.
  ) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title,
      price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * Get all products
   */
  public getAll() {
    const products = this.products;
    // const users = this.usersService.getAll();
    // return { products, users };
    return { products };
  }

  /**
   * Get one product by id
   */
  public getOneBy(id: number) {
    // bas 7etayna l 'id' bi 2alb l @Param haydi essma distructuring ye3ni a5adna bas l id
    // aya shi be5du mn l url bikoun string
    console.log(typeof id);
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`, {
        description: 'Product not found',
      });
    }
    return product;
  }

  /**
   * Update product
   */
  public update(id: string, updateProductDto: UpdateProductDto) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');

    console.log(updateProductDto);
    return { message: 'product updated successfully with id ' + id };
  }

  /**
   * Delete product
   */
  public delete(id: string) {
    // bas 7etayna l 'id' bi 2alb l @Param haydi essma distructuring ye3ni a5adna bas l id
    // aya shi be5du mn l url bikoun string
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return { message: 'product deleted' };
  }
}
