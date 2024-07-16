'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';
import Image from 'next/image';
import { barberHaircuts } from '@/actions/barberHaircuts';
import Spinner from '@/components/spinner';

interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: number;
    type: string;
}

const Products = ({ params }: any) => {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const barberID = params.id;
    const decodedURI = decodeURIComponent(barberID);
    const decodedID = atob(decodedURI);

    useEffect(() => {
        if (decodedID) {
            const cachedProducts = localStorage.getItem(`products_${decodedID}`);
            if (cachedProducts) {
                setProducts(JSON.parse(cachedProducts));
                setLoading(false);
            } else {
                init();
            }
        }
    }, [decodedID]);

    const init = () => {
        setLoading(true);
        startTransition(() => {
            barberHaircuts(decodedID).then((data: any) => {
                if (data?.error) {
                    setError(data.error);
                    return;
                } else if (data.haircuts) {
                    setProducts(data.haircuts);
                    localStorage.setItem(`products_${decodedID}`, JSON.stringify(data.haircuts));
                }
            }).catch((err) => {
                setError(`Something went wrong! Error: ${err}`);
            }).finally(() => {
                setLoading(false);
            });
        });
    };

    const handleProductSelect = (productID: string) => {
        router.push(`/schedule/calendar?barberID=${barberID}&productID=${productID}`);
    };

    const getGoogleDriveDirectLink = (shareableLink: string): string => {
        const fileIdMatch = shareableLink.match(/[-\w]{25,}/);
        if (!fileIdMatch) {
            throw new Error('Invalid Google Drive shareable link.');
        }
        const fileId = fileIdMatch[0];
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    };

    return loading ? <Spinner /> : (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Selecione um produto</h1>
            <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="cursor-pointer" onClick={() => handleProductSelect(product.id)}>
                        <Image src={getGoogleDriveDirectLink(product.image_url)} alt={product.name} width={200} height={200} className="rounded-lg" />
                        <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
