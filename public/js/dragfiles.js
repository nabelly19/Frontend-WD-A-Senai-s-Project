let selectedFile = null;

function dropHandler(ev) {
    ev.preventDefault();
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.remove('boxhover');
    dropZone.classList.add('divbox');

    if (ev.dataTransfer.items) {
        [...ev.dataTransfer.items].forEach((item) => {
            if (item.kind === "file") {
                const file = item.getAsFile();
                if (file.name.endsWith('.xlsx')) {
                    selectedFile = file;
                    handleFileDisplay(file);
                } else {
                    alert("Somente arquivos .xlsx são permitidos.");
                }
            }
        });
    } else {
        [...ev.dataTransfer.files].forEach((file) => {
            if (file.name.endsWith('.xlsx')) {
                selectedFile = file;
                handleFileDisplay(file);
            } else {
                alert("Somente arquivos .xlsx são permitidos.");
            }
        });
    }
}

function dragOverHandler(ev) {
    ev.preventDefault();
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.add('boxhover');
    dropZone.classList.remove('divbox');
}

function dragLeaveHandler(ev) {
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.remove('boxhover');
    dropZone.classList.add('divbox');
}

function openFileDialog() {
    document.getElementById('fileInput').click();
}

function handleFiles(files) {
    const file = files[0];
    if (file.name.endsWith('.xlsx')) {
        selectedFile = file;
        handleFileDisplay(file);
    } else {
        alert("Somente arquivos .xlsx são permitidos.");
    }
}

function handleFileDisplay(file) {
    const fileDetailsDiv = document.getElementById('fileDetails');
    const fileNameElement = document.getElementById('fileName');
    const dropZone = document.getElementById('dropZone');

    fileNameElement.textContent = file.name;
    fileDetailsDiv.style.display = 'block';
    dropZone.style.display = 'none';

    console.log("Selected file:", file);
}

function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
        alert("Por favor, selecione um arquivo Excel primeiro.");
        return;
    }

    const qcValue = document.getElementById('qcInput').value;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const filteredData = jsonData.filter(row => row['QC'] == qcValue);
        if (filteredData.length > 0) {
            console.log("Filtered Data:", filteredData[0]);
            alert(JSON.stringify(filteredData[0]));
        } else {
            alert("Nenhuma linha encontrada para o QC fornecido.");
        }
    };

    reader.readAsArrayBuffer(selectedFile);
}
