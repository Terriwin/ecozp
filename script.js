// Обновленные ставки
const rates = { A: 25, B: 7, C: 10, D: 10 };
const reportLabels = {
  A: "СПЕЦЗАКАЗЫ",
  B: "ПРИЁМ БЛОКОВ",
  C: "СОРТИРОВКА",
  D: "ПЕРЕНОС"
};
let employees = [];

function addEmployee() {
  employees.push({ name: "", A: 0, B: 0, C: 0, D: 0 });
  renderEmployees();
}

function removeEmployee(index) {
  employees.splice(index, 1);
  renderEmployees();
}

function updateReport(index, type, value) {
  const newValue = parseInt(value) || 0;
  if (newValue >= 0) {
    employees[index][type] = newValue;
    renderEmployees();
  }
}

function incrementReport(index, type) {
  employees[index][type]++;
  renderEmployees();
}

function decrementReport(index, type) {
  if (employees[index][type] > 0) {
    employees[index][type]--;
    renderEmployees();
  }
}

function renderEmployees() {
  const container = document.getElementById("employees");
  container.innerHTML = "";
  
  if (employees.length === 0) {
    container.innerHTML = `<p class="no-data">Нет сотрудников. Нажмите "Добавить"</p>`;
    return;
  }
  
  employees.forEach((employee, index) => {
    const row = document.createElement("div");
    row.className = "employee-row";
    
    row.innerHTML = `
      <input type="text" class="employee-name" placeholder="Ник сотрудника" 
             value="${employee.name}" 
             oninput="employees[${index}].name = this.value">
      
      <div class="report-controls">
        <button class="report-btn minus" onclick="decrementReport(${index}, 'A')">-</button>
        <input type="number" class="report-value" min="0" value="${employee.A}" 
               oninput="updateReport(${index}, 'A', this.value)">
        <button class="report-btn plus" onclick="incrementReport(${index}, 'A')">+</button>
      </div>
      
      <div class="report-controls">
        <button class="report-btn minus" onclick="decrementReport(${index}, 'B')">-</button>
        <input type="number" class="report-value" min="0" value="${employee.B}" 
               oninput="updateReport(${index}, 'B', this.value)">
        <button class="report-btn plus" onclick="incrementReport(${index}, 'B')">+</button>
      </div>
      
      <div class="report-controls">
        <button class="report-btn minus" onclick="decrementReport(${index}, 'C')">-</button>
        <input type="number" class="report-value" min="0" value="${employee.C}" 
               oninput="updateReport(${index}, 'C', this.value)">
        <button class="report-btn plus" onclick="incrementReport(${index}, 'C')">+</button>
      </div>
      
      <div class="report-controls">
        <button class="report-btn minus" onclick="decrementReport(${index}, 'D')">-</button>
        <input type="number" class="report-value" min="0" value="${employee.D}" 
               oninput="updateReport(${index}, 'D', this.value)">
        <button class="report-btn plus" onclick="incrementReport(${index}, 'D')">+</button>
      </div>
      
      <button class="remove-btn" onclick="removeEmployee(${index})">Удалить</button>
    `;
    
    container.appendChild(row);
  });
}

function calculate() {
  const activeEmployees = employees.filter(e => e && e.name.trim());
  if (activeEmployees.length === 0) {
    document.getElementById("result").innerHTML = `
      <div class="no-result">
        <p>Добавьте сотрудников и введите данные для расчета</p>
      </div>
    `;
    return;
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  const table = document.createElement("table");
  
  // Заголовок таблицы
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  
  // Первая ячейка заголовка
  headRow.innerHTML = `<th>Тип отчета</th>`;
  
  // Заголовки сотрудников
  activeEmployees.forEach(e => {
    headRow.innerHTML += `<th>${e.name}</th>`;
  });
  
  // Итоговая колонка
  headRow.innerHTML += `<th>Итого</th>`;
  
  thead.appendChild(headRow);
  table.appendChild(thead);

  // Тело таблицы
  const tbody = document.createElement("tbody");
  
  // Строки с отчетами
  ['A', 'B', 'C', 'D'].forEach(type => {
    const row = document.createElement("tr");
    
    // Ячейка типа отчета
    row.innerHTML = `
      <td>
        <div class="report-header">
          <span class="report-type">${reportLabels[type]}</span>
          <span class="report-rate">${rates[type]} АР</span>
        </div>
      </td>
    `;
    
    // Ячейки для каждого сотрудника
    activeEmployees.forEach(e => {
      row.innerHTML += `<td>${e[type]}</td>`;
    });
    
    // Итоговая ячейка для типа отчета
    const typeTotal = activeEmployees.reduce((sum, e) => sum + e[type], 0);
    row.innerHTML += `<td><strong>${typeTotal}</strong></td>`;
    
    tbody.appendChild(row);
  });

  // Итоговая строка по сотрудникам
  const totalRow = document.createElement("tr");
  totalRow.className = "total-row";
  
  // Заголовок итоговой строки
  totalRow.innerHTML = `<td><strong>Итого (АР)</strong></td>`;
  
  // Ячейки с итогами по сотрудникам
  activeEmployees.forEach(e => {
    const total = ['A', 'B', 'C', 'D'].reduce((sum, t) => sum + e[t] * rates[t], 0);
    totalRow.innerHTML += `<td><strong>${total}</strong></td>`;
  });
  
  // Общий итог
  const grandTotal = activeEmployees.reduce((totalSum, e) => {
    return totalSum + ['A', 'B', 'C', 'D'].reduce((sum, t) => sum + e[t] * rates[t], 0);
  }, 0);
  
  totalRow.innerHTML += `<td><strong>${grandTotal}</strong></td>`;
  
  tbody.appendChild(totalRow);
  table.appendChild(tbody);
  resultDiv.appendChild(table);
}

function copyToClipboard() {
  const table = document.querySelector("#result table");
  if (!table) return;

  let text = "";
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cells = Array.from(row.cells);
    let rowText = [];
    
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      let cellText = cell.textContent.trim();
      
      // Для строк с отчетами (кроме заголовка и итоговой строки)
      if (i > 0 && i < 5) {
        // Для первой ячейки берем только название отчета
        if (j === 0) {
          const reportType = cell.querySelector('.report-type');
          if (reportType) {
            cellText = reportType.textContent.trim();
          }
        }
      }
      
      rowText.push(cellText);
    }
    
    text += rowText.join('\t') + '\n';
  }

  navigator.clipboard.writeText(text).then(() => {
    const msg = document.getElementById("copyMsg");
    msg.textContent = "Таблица скопирована!";
    setTimeout(() => msg.textContent = "", 3000);
  });
}

function copySummaryToClipboard() {
  const activeEmployees = employees.filter(e => e && e.name.trim());
  if (activeEmployees.length === 0) {
    const msg = document.getElementById("copyMsg");
    msg.textContent = "Нет данных для копирования";
    setTimeout(() => msg.textContent = "", 3000);
    return;
  }

  let text = "Сотрудник\tЗарплата (АР)\n";
  
  activeEmployees.forEach(e => {
    const total = ['A', 'B', 'C', 'D'].reduce((sum, t) => sum + e[t] * rates[t], 0);
    text += `${e.name}\t${total}\n`;
  });

  navigator.clipboard.writeText(text).then(() => {
    const msg = document.getElementById("copyMsg");
    msg.textContent = "Смета скопирована!";
    setTimeout(() => msg.textContent = "", 3000);
  });
}

function resetAll() {
  if (confirm("Вы уверены, что хотите сбросить все данные?")) {
    employees = [];
    document.getElementById("result").innerHTML = "";
    document.getElementById("copyMsg").textContent = "";
    addEmployee();
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  addEmployee();
});