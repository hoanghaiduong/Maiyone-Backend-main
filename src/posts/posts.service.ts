import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { ServicesService } from 'src/services/services.service';
import { ProvidersService } from 'src/providers/providers.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/common/entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly categoryRepository: CategoriesService,

    private readonly serviceRepository: ServicesService,

    private readonly providerRepository: ProvidersService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { categoryId, serviceId, providerId, ...postData } = createPostDto;
    try {
      const category = categoryId
        ? await this.categoryRepository.findOne(categoryId)
        : null;
      const service = serviceId
        ? await this.serviceRepository.findOne(serviceId)
        : null;
      const provider = providerId
        ? await this.providerRepository.findOne(providerId)
        : null;

      const post = this.postRepository.create({
        ...postData,
        category,
        service,
        provider,
      });

      return this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['category', 'service', 'provider'],
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['category', 'service', 'provider'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      const post = await this.findOne(id);

      if (updatePostDto.categoryId) {
        post.category = await this.categoryRepository.findOne(
          updatePostDto.categoryId,
        );
      }

      if (updatePostDto.serviceId) {
        post.service = await this.serviceRepository.findOne(
          updatePostDto.serviceId,
        );
      }

      if (updatePostDto.providerId) {
        post.provider = await this.providerRepository.findOne(
          updatePostDto.providerId,
        );
      }

      Object.assign(post, updatePostDto);
      return this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const post = await this.findOne(id);
      await this.postRepository.remove(post);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
