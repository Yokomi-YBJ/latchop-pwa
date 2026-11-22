import Dexie, { Table } from 'dexie';
import { Product } from '../types/product';

export interface MetaEntry {
  key: string;
  value: string;
  updatedAt: number;
}

export class AppDatabase extends Dexie {
  products!: Table<Product, number>;
  metadata!: Table<MetaEntry, string>;

  constructor() {
    super('LaTchopClientDB');
    this.version(1).stores({
      products: 'id_produit, nom_produit, categorie, Prix',
      metadata: 'key',
    });
  }
}

export const db = new AppDatabase();

export async function cacheProductsLocally(products: Product[], version?: string): Promise<void> {
  try {
    await db.transaction('rw', db.products, db.metadata, async () => {
      await db.products.clear();
      await db.products.bulkPut(products);
      if (version) {
        await db.metadata.put({
          key: 'products_version',
          value: version,
          updatedAt: Date.now(),
        });
      }
    });
  } catch (error) {
    console.error('[Dexie] Erreur lors de la mise en cache locale des produits:', error);
  }
}

export async function getCachedProducts(): Promise<Product[]> {
  try {
    return await db.products.toArray();
  } catch (error) {
    console.error('[Dexie] Erreur lors de la lecture des produits mis en cache:', error);
    return [];
  }
}

export async function getCachedVersion(): Promise<string | null> {
  try {
    const meta = await db.metadata.get('products_version');
    return meta ? meta.value : null;
  } catch {
    return null;
  }
}
