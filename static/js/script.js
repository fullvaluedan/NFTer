document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const form = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const dropZone = document.getElementById('drop-zone');
    const instructions = document.getElementById('instructions');
    const generateBtn = document.getElementById('generate-btn');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const downloadBtn = document.getElementById('download-btn');

    // Function to reset the UI
    function resetUI() {
        previewContainer.classList.add('hidden');
        resultContainer.classList.add('hidden');
        loadingSpinner.classList.add('hidden');
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
        instructions.classList.remove('hidden');
        imagePreview.src = '';
        resultImage.src = '';
        fileInput.value = '';
        downloadBtn.href = '#';
    }

    // Add click event to dropzone to trigger file input
    dropZone.addEventListener('click', function() {
        fileInput.click();
    });

    // File input change event
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            handleFileSelection(this.files[0]);
        }
    });

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            dropZone.classList.add('active');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            dropZone.classList.remove('active');
        }, false);
    });

    dropZone.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleFileSelection(file);
    }, false);

    // Handle the selected file
    function handleFileSelection(file) {
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showError('Please select an image file (PNG, JPG, JPEG, GIF)');
            return;
        }

        // Display preview
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove('hidden');
            instructions.classList.add('hidden');
            errorMessage.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    // Form submit event
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!fileInput.files || !fileInput.files[0]) {
            showError('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        
        // Show loading state
        loadingSpinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        resultContainer.classList.add('hidden');
        generateBtn.disabled = true;

        // Send request to the server
        fetch('/generate', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'An error occurred during processing');
                });
            }
            return response.json();
        })
        .then(data => {
            // Hide loading state
            loadingSpinner.classList.add('hidden');
            
            // Show result
            resultImage.src = data.image_url;
            resultContainer.classList.remove('hidden');
            
            // Set download link
            downloadBtn.href = data.image_url;
            downloadBtn.download = 'naruto-style-image.png';
            
            generateBtn.disabled = false;
        })
        .catch(error => {
            loadingSpinner.classList.add('hidden');
            generateBtn.disabled = false;
            showError(error.message || 'Failed to transform image. Please try again.');
        });
    });

    // Try again button
    tryAgainBtn.addEventListener('click', resetUI);

    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    // Initialize UI
    resetUI();
});
