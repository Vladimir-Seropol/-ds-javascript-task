import './css/style.css';



const app = document.getElementById('app');

// Создаем элементы
const form = document.createElement('form');
const container = document.createElement('div');
const customFileUpload = document.createElement('div');
const fileInput = document.createElement('input');
const label = document.createElement('label');
const uploadButton = document.createElement('button');
const fileList = document.createElement('div'); 
const h1 = document.createElement('h1');
const p = document.createElement('p');


h1.innerHTML = 'Загрузите Ваши файлы';
p.innerHTML = 'Вы можете загрузить до 5 файлов JPG, JPEG, PNG, <br> размер одного — до 10 МБ'



// Настраиваем input
fileInput.type = 'file';
fileInput.accept = 'image/*'; 
fileInput.multiple = true; 
fileInput.id = 'file-input';

// Устанавливаем стиль фона с SVG
uploadButton.style.backgroundImage = "url('./public/icon_cloud.svg')"; 
uploadButton.style.backgroundSize = 'cover';

// Добавляем класс для стилей
uploadButton.className = 'container__file-button';
form.className = 'form';
container.className = 'container';
fileList.className = 'file__list';
customFileUpload.className = 'container__file';
label.className = 'container__file-label';
label.setAttribute('for', 'file-input');
label.textContent = 'Выберите файлы';
fileList.id = 'fileList'




let selectedFiles = [];

// Функция для проверки, был ли файл уже добавлен
function isFileAlreadySelected(file) {
    return selectedFiles.some(selectedFile => 
        selectedFile.name === file.name && selectedFile.size === file.size);
}

// Функция для обновления списка файлов и их превью
let draggedIndex; 

function updateFileList() {
    fileList.innerHTML = ''; 
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file__item';
        fileItem.draggable = true; 

        // Создаем элемент img для превью
        const imgPreview = document.createElement('img');
        imgPreview.src = URL.createObjectURL(file); 
        fileItem.prepend(imgPreview); 

        const fileName = document.createElement('span');
        fileName.textContent = file.name; 
        fileItem.appendChild(fileName); 

        // Создаем элемент для отображения размера файла
        const fileSize = document.createElement('span');
        fileSize.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} МБ`;
        fileItem.appendChild(fileSize);
        
        // Создаем кнопку удаления
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.style.marginLeft = '10px'; 
        deleteButton.onclick = () => {
            selectedFiles.splice(index, 1); 
            updateFileList(); 
        };

        fileItem.appendChild(deleteButton); 
        fileList.appendChild(fileItem);

        // Обработчики событий для перетаскивания
        fileItem.addEventListener('dragstart', (event) => {
            draggedIndex = index; 
            event.dataTransfer.effectAllowed = 'move'; 
            event.dataTransfer.setData('image', ''); 
        });

        fileItem.addEventListener('dragover', (event) => {
            event.preventDefault(); 
            event.dataTransfer.dropEffect = 'move'; я
        });

        fileItem.addEventListener('drop', (event) => {
            event.preventDefault(); е
            if (draggedIndex !== index) { 

                // Меняем местами файлы в массиве
                const [draggedFile] = selectedFiles.splice(draggedIndex, 1); 
                selectedFiles.splice(index, 0, draggedFile); 
                updateFileList(); 
            }
        });
    });
}

// Добавляем обработчики событий для drag-and-drop на весь список
fileList.addEventListener('dragover', handleDragOver);
fileList.addEventListener('drop', handleDrop);

// Обработчик события для обновления списка файлов через input
fileInput.addEventListener('change', handleFileInputChange);

// Обработчик для drag-and-drop
function handleDragOver(event) {
    event.preventDefault();
    fileList.classList.add('drag-over'); // Добавляем класс
}

function handleDrop(event) {
    event.preventDefault();
    fileList.classList.remove('drag-over'); // Убираем класс

    const droppedFiles = Array.from(event.dataTransfer.files); // Получаем файлы из события drop
    handleFileSelection(droppedFiles); 
}

// Обработчик изменения input
function handleFileInputChange() {
    const files = Array.from(this.files);
    handleFileSelection(files); 
}



function handleFileSelection(files) {
    const validFiles = validateFiles(files); 

    // Создаем элемент загрузчика
    const loader = document.createElement('div');
    loader.className = 'loader'; 
    loader.style.display = 'none'; 

    // Добавляем текст в элемент загрузчика
    const loadingText = document.createElement('span');
    loadingText.textContent = 'Загрузка...';
    loader.appendChild(loadingText);

    document.body.appendChild(loader); 

    // Ограничиваем количество добавляемых файлов
    if (selectedFiles.length + validFiles.length > 5) {
        alert('Превышено допустимое количество файлов: 5.');
        return;
    }

    // Показываем индикатор загрузки
    loader.style.display = 'block';

    // Добавляем только уникальные файлы
    validFiles.forEach(file => {
        if (!selectedFiles.includes(file)) {
            selectedFiles.push(file);
        }
    });

   
    label.textContent = selectedFiles.length > 0 ? `${selectedFiles.length} файл(ов) выбрано` : 'Выберите файлы';
    
    updateFileList(); 

    // Имитация асинхронной операции (например, загрузка файла)
    setTimeout(() => {
        // Скрываем индикатор загрузки после завершения обработки
        loader.style.display = 'none';
    }, 2000);
}




// Функция для проверки валидности файлов

function validateFiles(files) {
    const validFiles = [];
    for (const file of files) {
        if (!file.type.match('image.*')) {
            alert(`Файл ${file.name} не является изображением. Пожалуйста, выберите файл в формате jpg, jpeg или png.`);
            continue; 
        }

        if (file.size > 10 * 1024 * 1024) {
            alert(`Файл ${file.name} превышает максимальный размер в 10 MB и не будет добавлен.`);
            continue;B
        }

        if (isFileAlreadySelected(file)) {
            alert(`Файл ${file.name} уже был добавлен.`);
            continue; 
        }

        validFiles.push(file); 
    }
    return validFiles;
}





// Создаем элемент загрузчика
const loader = document.createElement('div');
loader.className = 'loaderer'; 
loader.style.display = 'none'; 

// Добавляем текст в элемент загрузчика
const loadingText = document.createElement('span');
loadingText.textContent = 'Загрузка...';
loadingText.style.display = 'none'; 
loader.appendChild(loadingText);

document.body.appendChild(loader); 











// Обработчик события для отправки файлов на сервер

uploadButton.addEventListener('click', async function() {
   

    const selectedFilesFromInput = Array.from(fileInput.files || []); 
    const selectedFilesFromList = Array.from(fileList.files || []); 

    // Объединяем массивы выбранных файлов
    const allSelectedFiles = [...selectedFilesFromInput, ...selectedFilesFromList, ...selectedFiles];

    // Проверка на наличие файлов
    if (allSelectedFiles.length === 0) {
        alert('Пожалуйста, выберите файлы перед отправкой.');
        return;
    }

    const formData = new FormData();
    allSelectedFiles.forEach(file => {
        formData.append('uploads', file);
    });

    // Логируем содержимое FormData
    formData.forEach((value, key) => {
        console.log(key, value);
    });

    // Показываем индикатор загрузки
    loader.style.display = 'block';
    loadingText.style.display = 'block'; 

    try {
        // Отправка файлов на сервер
        const response = await fetchData(formData);
        

        // Обработка успешного ответа
        if (response.ok) {
            const data = await response.json();
            const ul = document.querySelector('ul');
            data.forEach(item => {
                ul.innerHTML += '<li>' + item.id + '</li>';
            });
        } else {
            console.error('Ошибка ответа сервера:', response.statusText);
            alert('Ошибка при отправке файлов: ' + response.statusText);
        }
    } catch (error) {
        console.error('Ошибка при отправке файлов:', error);
        alert('Произошла ошибка при отправке файлов: ' + error.message);
    } finally {




        // Задержка перед скрытием текста загрузки
        setTimeout(() => {
            loader.style.display = 'none';
            loadingText.style.display = 'none';
        }, 2000); // Задержка 2000 мс (2 секунды)
    }
});


// Функция загрузки файлов на сервер

async function fetchData(formData) {
    const response = await fetch('https://1774c26fa0b449ed.mokky.dev/uploads', {
         method: 'POST',
        body: formData,
    });
    const data = await resp.json();

    if (!response.ok) {
        let errorData;

        // Попробуем получить JSON, если он доступен
        try {
            errorData = await response.json();
        } catch (error) {
            // Если не удается получить JSON, можно обработать это как текст
            const errorText = await response.text();
            console.error('Ошибка ответа сервера:', errorText);
            throw new Error(`Ошибка ${response.status}: ${errorText || 'Ошибка при отправке файлов.'}`);
        }

        console.error('Ошибка ответа сервера:', errorData);
        throw new Error(`Ошибка ${response.status}: ${errorData.message || 'Ошибка при отправке файлов.'}`);
    }

    return data;
}


  
// Собираем элементы вместе
app.appendChild(form); 
form.appendChild(h1);
form.appendChild(p);
form.appendChild(container); 
customFileUpload.appendChild(fileInput);
container.appendChild(label);
container.appendChild(uploadButton); 
container.appendChild(customFileUpload);
form.appendChild(fileList); 

form.appendChild(loader);
form.appendChild(loadingText);

