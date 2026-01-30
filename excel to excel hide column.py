import pandas as pd
import os
from pathlib import Path

def process_excel_files(folder_path):
    """
    Memproses semua file Excel dalam folder:
    - Menyembunyikan kolom tertentu
    - Mengubah nama kolom
    - Mengubah tipe data kolom NoUrutRuta menjadi number
    - Mengurutkan berdasarkan kolom NoUrutRuta (kecil ke besar)
    - Menyimpan kembali file
    
    Args:
        folder_path: Path ke folder yang berisi file Excel
    """
    
    # Kolom yang akan disembunyikan (index dimulai dari 0)
    # A=0, B=1, C=2, D=3, E=4, F=5, H=7, I=8, J=9, U=20, V=21, W=22, X=23, Y=24, Z=25, 
    # AA=26, AD=29, AE=30, AF=31, AI=34, AJ=35, AK=36, AL=37, AM=38, AN=39, AO=40, 
    # AP=41, AQ=42, AR=43, AS=44, AT=45, AU=46, AV=47
    columns_to_hide = [0, 1, 2, 3, 4, 5, 7, 8, 9, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 
                       34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
    
    # Mapping nama kolom baru (index kolom: nama baru)
    # K=10, L=11, M=12, N=13, O=14, P=15, Q=16, R=17, S=18, T=19
    column_rename_mapping = {
        10: 'id',
        11: 'NoKel',
        12: 'NamaKK',
        13: 'NoBang',
        14: 'Alamat',
        15: 'SLS',
        16: 'PMM',
        17: 'NoUrutRuta',
        18: 'ARTLain',
        19: 'NamaKRT'
    }
    
    # Mendapatkan semua file Excel di folder
    folder = Path(folder_path)
    excel_files = list(folder.glob('*.xlsx')) + list(folder.glob('*.xls'))
    
    if not excel_files:
        print(f"Tidak ada file Excel ditemukan di folder: {folder_path}")
        return
    
    print(f"Ditemukan {len(excel_files)} file Excel")
    
    # Proses setiap file
    for file_path in excel_files:
        try:
            print(f"\nMemproses: {file_path.name}")
            
            # Baca file Excel
            df = pd.read_excel(file_path)
            
            # Simpan nama kolom asli
            original_columns = df.columns.tolist()
            
            # Buat list kolom yang akan dipertahankan (tidak di-hide)
            columns_to_keep = [i for i in range(len(original_columns)) if i not in columns_to_hide]
            
            # Filter dataframe hanya dengan kolom yang dipertahankan
            df_filtered = df.iloc[:, columns_to_keep]
            
            # Rename kolom sesuai mapping (perlu adjust index karena sudah di-filter)
            new_column_names = []
            col_index = 0
            for i in range(len(original_columns)):
                if i not in columns_to_hide:
                    if i in column_rename_mapping:
                        new_column_names.append(column_rename_mapping[i])
                    else:
                        new_column_names.append(df_filtered.columns[col_index])
                    col_index += 1
            
            df_filtered.columns = new_column_names
            
            # Konversi kolom NoUrutRuta menjadi numeric
            if 'NoUrutRuta' in df_filtered.columns:
                # Konversi ke numeric, nilai yang tidak bisa dikonversi akan menjadi NaN
                df_filtered['NoUrutRuta'] = pd.to_numeric(df_filtered['NoUrutRuta'], errors='coerce')
                
                print(f"  - Tipe data NoUrutRuta diubah menjadi: {df_filtered['NoUrutRuta'].dtype}")
                
                # Cek jika ada nilai NaN setelah konversi
                nan_count = df_filtered['NoUrutRuta'].isna().sum()
                if nan_count > 0:
                    print(f"  ⚠ Warning: {nan_count} baris memiliki nilai NoUrutRuta yang tidak valid (akan diurutkan di akhir)")
                
                # Urutkan berdasarkan NoUrutRuta (kecil ke besar)
                # NaN akan otomatis diletakkan di akhir
                df_filtered = df_filtered.sort_values(by='NoUrutRuta', ascending=True, na_position='last')
                
                # Reset index setelah sorting
                df_filtered = df_filtered.reset_index(drop=True)
                
                print(f"  - Data diurutkan berdasarkan NoUrutRuta (ascending)")
                print(f"  - Nilai NoUrutRuta min: {df_filtered['NoUrutRuta'].min()}")
                print(f"  - Nilai NoUrutRuta max: {df_filtered['NoUrutRuta'].max()}")
            else:
                print(f"  ⚠ Warning: Kolom 'NoUrutRuta' tidak ditemukan")
            
            # Simpan kembali ke file Excel (replace)
            output_path = file_path
            df_filtered.to_excel(output_path, index=False, engine='openpyxl')
            
            print(f"✓ Berhasil diproses dan disimpan: {file_path.name}")
            print(f"  - Kolom awal: {len(original_columns)}")
            print(f"  - Kolom akhir: {len(df_filtered.columns)}")
            print(f"  - Total baris: {len(df_filtered)}")
            
        except Exception as e:
            print(f"✗ Error memproses {file_path.name}: {str(e)}")
            import traceback
            traceback.print_exc()
    
    print("\n=== Selesai ===")

# Contoh penggunaan
if __name__ == "__main__":
    # Ganti dengan path folder Anda
    # folder_path = "path/to/your/folder"  # Contoh: "C:/Users/Username/Documents/DataExcel"
    
    # Atau gunakan folder saat ini
    folder_path = "."
    
    process_excel_files(folder_path)