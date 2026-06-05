import { Review } from 'src/reviews/review.entity';
import { User } from 'src/users/user.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
// essm l class lezm ykoun signle
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.product, { eager: true }) // bas 7aded l "{ eager: true }" hon ye3ni ysir 3a kel l mehode aya fetch 3al product la7 yjib l reviews kamen
  reviews: Review[]; // fi relation 1 to many between product and review

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;
}
