import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

// type ProductType = { id: number; title: string; price: number };

@Injectable()
export class ProductsService {
  // hon 3m neta3ml l users service bl product service hayda essmu i3temed 5ariji la2n manon bi nafess l folder
  // constructor(private readonly usersService: UsersService) {}

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create new product
   * @param dto data for creating new product
   * @param userId id of the logged in user (Admin)
   * @returns the created product from the database
   */
  public async createProduct(
    dto: CreateProductDto,
    userId: number,
    // { title, price }: CreateProductDto,
    // hon mnesta3ml "whitelist: true" kerml ma ne5od mn l server l properties ma mne7teja
    // hon mnesta3ml "forbidNonWhitelisted: true" iza l server ba3atlna properties ma bedna yeha bta3tina error (bad request)
    // kerml ma kelshwai netkob l validation la kel request fa mnektbon bl "main.ts" bisuru gloably.
  ) {
    // const newProduct: ProductType = {
    //   id: this.products.length + 1,
    //   title,
    //   price,
    // };
    // this.products.push(newProduct);
    // return newProduct;
    //-------------------------
    const user = await this.usersService.getCurrentUser(userId);
    const newProduct = this.productsRepository.create({
      ...dto,
      title: dto.title.toLowerCase(),
      user,
    });
    return this.productsRepository.save(newProduct); // haydi l operation asynchronous, so mafi de3i ektob (sync/await)
  }

  /**
   * Get all products
   * @returns collection of products
   */
  public getAll() {
    // const products = this.products;
    // const users = this.usersService.getAll();
    // return { products, users };
    // return { products };
    return this.productsRepository
      .find
      // {relations: { user: true, reviews: true }}, // hol bikouni bi 2alb l ()
      ();
  }

  /**
   * Get one product by id
   * @param id id of the product
   * @returns product from the database
   */
  public async getOneBy(id: number): Promise<Product> {
    // bas 7etayna l 'id' bi 2alb l @Param haydi essma distructuring ye3ni a5adna bas l id
    // aya shi be5du mn l url bikoun string
    // console.log(typeof id);
    // const product = this.products.find((p) => p.id === id);
    const product = await this.productsRepository.findOne({
      where: { id },
      // relations: { user: true, reviews: true }, // shelna haydi la2n 3mlna hek "{ eager: true }" bl entity file
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`, {
        description: 'Product not found',
      });
    }
    return product;
  }

  /**
   * Update product
   * @param id id of the product
   * @param dto data for updating the existing product
   * @returns  the updated product
   */
  public async update(id: number, dto: UpdateProductDto) {
    const product = await this.getOneBy(id);
    product.title = dto.title ?? product.title;
    product.description = dto.description ?? product.description;
    product.price = dto.price ?? product.price;
    return this.productsRepository.save(product);
  }

  /**
   * Delete product
   * @param id id of the product
   * @returns a success message
   */
  public async delete(id: number) {
    // bas 7etayna l 'id' bi 2alb l @Param haydi essma distructuring ye3ni a5adna bas l id
    // aya shi be5du mn l url bikoun string
    // const product = this.products.find((p) => p.id === parseInt(id));
    // if (!product)
    //   throw new NotFoundException(`Product with id ${id} not found`);
    // return { message: 'product deleted' };
    const product = await this.getOneBy(id);
    await this.productsRepository.remove(product);
    return { message: 'product deleted' };
  }
}
