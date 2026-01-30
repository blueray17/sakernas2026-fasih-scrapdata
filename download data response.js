// ============================================================================
// FUNGSI 1: Fetch data dengan filter doneListing = true
// ============================================================================
async function fetchDataBPSFiltered() {
  const url = 'https://fasih-sm.bps.go.id/assignment-general/api/assignment-region/datatable?periodeId=de57c799-05ef-4d5a-b0a8-d70adfa68090';
  
  function getXSRFToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': getXSRFToken()
  };
  
  const requestBody = {
    "draw": 2,
    "columns": [
      {"data": 0, "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": 1, "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": 2, "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": 3, "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": 4, "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}}
    ],
    "order": [{"column": 0, "dir": "asc"}],
    "start": 0,
    "length": 10000,
    "search": {"value": "", "regex": false}
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      credentials: 'include'
    });
    const data = await response.json();
    
    // Filter data yang done listing = true
    const doneListingData = data.data.filter(item => item.doneListing === true);
    
    console.log('✅ DATA DENGAN DONE LISTING = TRUE');
    console.log(`Total: ${doneListingData.length} dari ${data.data.length} records`);
    
    return doneListingData;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ============================================================================
// FUNGSI 2: Fetch detail berdasarkan regionId
// ============================================================================
async function fetchDetailByRegionId(regionId, length = 1000) {
  const url = 'https://fasih-sm.bps.go.id/analytic/api/v2/assignment/datatable-all-user-survey-periode';
  
  function getXSRFToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': getXSRFToken()
  };

  const requestBody = {
    "draw": 3,
    "columns": [
      {"data": "id", "name": "", "searchable": true, "orderable": false, "search": {"value": "", "regex": false}},
      {"data": "codeIdentity", "name": "", "searchable": true, "orderable": false, "search": {"value": "", "regex": false}},
      {"data": "data1", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": "data2", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": "data3", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": "data4", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": "data5", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": "data6", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": "data7", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": "data8", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": "data9", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}},
      {"data": "data10", "name": "", "searchable": true, "orderable": true, "search": {"value": "", "regex": false}}
    ],
    "order": [{"column": 0, "dir": "asc"}],
    "start": 0,
    "length": length,
    "search": {"value": "", "regex": false},
    "assignmentExtraParam": {
      "region6Id": regionId,
      "surveyPeriodId": "de57c799-05ef-4d5a-b0a8-d70adfa68090",
      "assignmentErrorStatusType": -1,
      "filterTargetType": "TARGET_ONLY"
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      credentials: 'include'
    });

    const result = await response.json();
    
    // Data ada di result.searchData
    const dataArray = result.searchData || [];
    
    console.log(`   📋 Data: ${dataArray.length} rows`);
    
    return dataArray;
    
  } catch (error) {
    console.error(`   ❌ Error fetching detail for regionId ${regionId}:`, error);
    throw error;
  }
}

// ============================================================================
// FUNGSI 3: Helper untuk mendapatkan nama region dari object region
// ============================================================================
function getRegionName(item) {
  // Coba ambil dari berbagai level region, dari level terkecil ke terbesar
  if (item.region) {
    if (item.region.level6 && item.region.level6.name) {
      return item.region.level6.name;
    }
    if (item.region.level5 && item.region.level5.name) {
      return item.region.level5.name;
    }
    if (item.region.level4 && item.region.level4.name) {
      return item.region.level4.name;
    }
    if (item.region.level3 && item.region.level3.name) {
      return item.region.level3.name;
    }
    if (item.region.level2 && item.region.level2.name) {
      return item.region.level2.name;
    }
    if (item.region.level1 && item.region.level1.name) {
      return item.region.level1.name;
    }
  }
  
  // Fallback jika tidak ada region
  return item.regionName || 'unknown_region';
}

// ============================================================================
// FUNGSI 4: Load SheetJS Library
// ============================================================================
function loadSheetJS() {
  return new Promise((resolve, reject) => {
    if (typeof XLSX !== 'undefined') {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
    script.onload = () => {
      console.log('✅ SheetJS library loaded');
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load SheetJS library'));
    document.head.appendChild(script);
  });
}

// ============================================================================
// FUNGSI 5: Download Excel
// ============================================================================
function downloadExcel(data, filename) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, filename);
}

// ============================================================================
// FUNGSI 6: Download semua data ke file Excel terpisah per region
// ============================================================================
async function fetchAllDataAndDownloadExcel() {
  try {
    // Load SheetJS jika belum
    if (typeof XLSX === 'undefined') {
      console.log('📦 Loading SheetJS library...');
      await loadSheetJS();
    }
    
    console.log('🚀 Mulai fetch data...\n');
    
    // Fetch data dengan doneListing = true
    const doneListingData = await fetchDataBPSFiltered();
    console.log(`\n✅ Ditemukan ${doneListingData.length} region dengan doneListing = true\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Loop setiap region
    for (let i = 0; i < doneListingData.length; i++) {
      const item = doneListingData[i];
      const regionId = item.regionId;
      
      // Ambil nama region dari object region
      const regionName = item.smallestRegionFullCode;
      // const regionName = getRegionName(item);
      // const sanitizedName = regionName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      console.log(`\n[${i + 1}/${doneListingData.length}] Processing: ${regionName}`);
      console.log(`   RegionId: ${regionId}`);
      
      try {
        // Fetch detail data
        const detailData = await fetchDetailByRegionId(regionId, 1000);
        
        if (detailData && detailData.length > 0) {
          // Download ke Excel dengan format: nama_region.xlsx
          const filename = `${regionName}.xlsx`;
          downloadExcel(detailData, filename);
          console.log(`   ✅ Downloaded: ${filename} (${detailData.length} rows)`);
          successCount++;
        } else {
          console.log(`   ⚠️  No data found for this region`);
          failCount++;
        }
        
        // Delay 1 detik untuk menghindari rate limit
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`   ❌ Error:`, error.message);
        failCount++;
      }
    }
    
    console.log('\n\n✅ PROSES SELESAI!');
    console.log(`📊 Berhasil: ${successCount} file | Gagal: ${failCount} file`);
    
  } catch (error) {
    console.error('❌ Error dalam proses:', error);
    throw error;
  }
}

// ============================================================================
// FUNGSI 7: Download semua data ke 1 file Excel dengan multiple sheets
// ============================================================================
async function fetchAllDataAndDownloadSingleExcel() {
  try {
    if (typeof XLSX === 'undefined') {
      console.log('📦 Loading SheetJS library...');
      await loadSheetJS();
    }
    
    console.log('🚀 Mulai fetch data...\n');
    
    const doneListingData = await fetchDataBPSFiltered();
    console.log(`\n✅ Ditemukan ${doneListingData.length} region dengan doneListing = true\n`);
    
    const workbook = XLSX.utils.book_new();
    let successCount = 0;
    
    for (let i = 0; i < doneListingData.length; i++) {
      const item = doneListingData[i];
      const regionId = item.regionId;
      
      // Ambil nama region dari object region
//      const regionName = getRegionName(item);
      const regionName = item.smallestRegionFullCode;
      
      console.log(`\n[${i + 1}/${doneListingData.length}] Processing: ${regionName}`);
      console.log(`   RegionId: ${regionId}`);
      
      try {
        const detailData = await fetchDetailByRegionId(regionId, 1000);
        
        if (detailData && detailData.length > 0) {
          // Batasi nama sheet max 31 karakter (batasan Excel)
          let sheetName = regionName.substring(0, 31).replace(/[^a-z0-9]/gi, '_');
          
          // Pastikan nama sheet unique
          let counter = 1;
          let finalSheetName = sheetName;
          while (workbook.SheetNames && workbook.SheetNames.includes(finalSheetName)) {
            finalSheetName = `${sheetName.substring(0, 28)}_${counter}`;
            counter++;
          }
          
          const worksheet = XLSX.utils.json_to_sheet(detailData);
          XLSX.utils.book_append_sheet(workbook, worksheet, finalSheetName);
          console.log(`   ✅ Added sheet: ${finalSheetName} (${detailData.length} rows)`);
          successCount++;
        } else {
          console.log(`   ⚠️  No data found`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`   ❌ Error:`, error.message);
      }
    }
    
    // Download single file
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `BPS_All_Regions_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
    
    console.log(`\n\n✅ SELESAI! File downloaded: ${filename}`);
    console.log(`📊 Total sheets: ${successCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// ============================================================================
// FUNGSI 8: Test dengan 1 region dulu
// ============================================================================
async function testSingleRegion() {
  console.log('🧪 Testing dengan 1 region...\n');
  const doneListingData = await fetchDataBPSFiltered();
  
  if (doneListingData.length > 0) {
    const item = doneListingData[0];
    const regionId = item.regionId;
//    const regionName = getRegionName(item);
    const regionName = item.smallestRegionFullCode;
    
    console.log(`\nTesting region: ${regionName}`);
    console.log(`RegionId: ${regionId}`);
    console.log('\nRegion object structure:');
    console.log(item.region);
    
    const detail = await fetchDetailByRegionId(regionId, 1000);
    
    console.log(`\n📋 Total data: ${detail.length} rows`);
    console.log('\nSample data (first 2 rows):');
    console.table(detail.slice(0, 2));
    
    console.log(`\n📁 Filename akan jadi: ${regionName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`);
    
    return detail;
  }
}

// ============================================================================
// INFORMASI PENGGUNAAN
// ============================================================================
console.log('✅ Semua fungsi telah dimuat!');
console.log('\n📌 Cara penggunaan:');
console.log('1. testSingleRegion()                    - Test dengan 1 region');
console.log('2. fetchAllDataAndDownloadExcel()        - Download file terpisah per region');
console.log('3. fetchAllDataAndDownloadSingleExcel()  - Download 1 file dengan multiple sheets');
console.log('\n💡 Penamaan file:');
console.log('   - File akan dinamai berdasarkan kolom "region" dari endpoint pertama');
console.log('   - RegionId digunakan sebagai parameter untuk endpoint kedua');
console.log('\n🎯 Silakan jalankan testSingleRegion() terlebih dahulu!');