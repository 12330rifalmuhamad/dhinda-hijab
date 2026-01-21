export const uploadToCloudinary = async (file, onProgress, folder = "dhinda_hijab_products") => {
    // 1. Get signature
    const signRes = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
    });

    if (!signRes.ok) {
        throw new Error('Failed to get upload signature');
    }

    const { signature, timestamp, cloud_name, api_key } = await signRes.json();

    // 2. Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;

        xhr.open('POST', url, true);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                onProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                resolve(data.secure_url);
            } else {
                console.error('Cloudinary upload error:', xhr.responseText);
                reject(new Error('Cloudinary upload failed'));
            }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));

        xhr.send(formData);
    });
};
