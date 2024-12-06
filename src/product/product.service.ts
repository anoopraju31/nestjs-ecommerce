import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { FilterProductDto } from './dtos/filter-product.dto';
import { CreateProductDto } from './dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();

    return products;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();

    return product;
  }

  async getFilteredProducts(
    filterProductDTO: FilterProductDto,
  ): Promise<Product[]> {
    const { category, search } = filterProductDTO;
    let products = await this.getAllProducts();

    if (search) {
      products = products.filter(
        (product) =>
          product.name.includes(search) || product.description.includes(search),
      );
    }

    if (category) {
      products = products.filter((product) => product.category === category);
    }

    return products;
  }

  async addProduct(creatProductDTO: CreateProductDto): Promise<Product> {
    const newProduct = await this.productModel.create(creatProductDTO);

    return newProduct.save();
  }

  async updateProduct(
    id: string,
    createProductDTO: CreateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      createProductDTO,
      { new: true },
    );

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);

    return deletedProduct;
  }
}
