document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const progressArea = document.getElementById('progress-area');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const transferStatus = document.getElementById('transfer-status');
    const receivedFilesSection = document.getElementById('received-files');
    const fileListContainer = document.getElementById('file-list');

    let selectedFiles =;

    fileInput.addEventListener('change', (event) => {
        selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length > 0) {
            console.log('Selected files:', selectedFiles);
            // For demonstration, let's simulate a transfer
            startTransfer(selectedFiles);
        }
    });

    async function startTransfer(files) {
        if (!files || files.length === 0) {
            return;
        }

        document.getElementById('file-selection').classList.add('hidden');
        progressArea.classList.remove('hidden');
        transferStatus.textContent = `Preparing to transfer ${files.length} file(s)...`;
        progressBar.style.width = '0%';
        progressPercentage.textContent = '0%';

        let totalSize = files.reduce((sum, file) => sum + file.size, 0);
        let transferredSize = 0;

        for (const file of files) {
            transferStatus.textContent = `Transferring ${file.name}...`;

            // Simulate compression (in a real scenario, you'd use a library)
            const compressedFile = await compressFile(file);
            const compressedBlob = new Blob([compressedFile]);
            const chunkSize = 1024; // Example chunk size
            let sentChunkSize = 0;

            while (sentChunkSize < compressedBlob.size) {
                const chunk = compressedBlob.slice(sentChunkSize, sentChunkSize + chunkSize);
                // In a real application, you would send this chunk to a receiver
                await simulateNetworkRequest(chunk.size); // Simulate sending data
                sentChunkSize += chunk.size;
                transferredSize += chunk.size;
                const percentage = (transferredSize / totalSize) * 100;
                updateProgress(percentage);
            }
            console.log(`Finished transferring: ${file.name} (compressed)`);
        }

        transferStatus.textContent = 'Transfer complete!';
        setTimeout(() => {
            progressArea.classList.add('hidden');
            receivedFilesSection.classList.remove('hidden');
            displayReceivedFiles(files); // For demonstration, we'll just display the original files
        }, 1500);
    }

    async function compressFile(file) {
        // In a real scenario, you would use a compression library like pako
        // For this example, we'll just return the original file content as a Uint8Array
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(new Uint8Array(event.target.result));
            };
            reader.readAsArrayBuffer(file);
        });
    }

    async function simulateNetworkRequest(size) {
        // Simulate the time it takes to send data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, size / 100); // Adjust the divisor to control the speed
        });
    }

    function updateProgress(percentage) {
        progressBar.style.width = `${percentage}%`;
        progressPercentage.textContent = `${Math.round(percentage)}%`;
    }

    function displayReceivedFiles(files) {
        fileListContainer.innerHTML = '';
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');

            let thumbnail;
            if (file.type.startsWith('image/')) {
                thumbnail = document.createElement('img');
                thumbnail.classList.add('thumbnail');
                const reader = new FileReader();
                reader.onload = (event) => {
                    thumbnail.src = event.target.result;
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith('video/')) {
                thumbnail = document.createElement('div');
                thumbnail.classList.add('thumbnail-container');
                thumbnail.textContent = 'Video File'; // Basic placeholder
                // Creating a real video thumbnail in the browser is more complex
            } else {
                thumbnail = document.createElement('div');
                thumbnail.classList.add('thumbnail-container');
                thumbnail.textContent = 'File'; // Generic placeholder
            }

            const thumbnailContainer = document.createElement('div');
            thumbnailContainer.classList.add('thumbnail-container');
            thumbnailContainer.appendChild(thumbnail);
            thumbnailContainer.addEventListener('click', () => {
                // Basic download functionality
                const url = URL.createObjectURL(file);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });

            const fileName = document.createElement('p');
            fileName.classList.add('file-name');
            fileName.textContent = file.name;

            fileItem.appendChild(thumbnailContainer);
            fileItem.appendChild(fileName);
            fileListContainer.appendChild(fileItem);
        });
    }
});
