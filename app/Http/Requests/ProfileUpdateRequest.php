<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            // 1. Validasi Nama (Wajib)
            'name' => ['required', 'string', 'max:255'],

            // 2. Validasi Username (Wajib, Unik, Tanpa Spasi)
            'username' => [
                'required', 
                'string', 
                'max:255', 
                'alpha_dash', // Hanya huruf, angka, dash (-), dan underscore (_)
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            // 3. Validasi Email (Wajib, Unik)
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            // 4. Validasi Interest/Minat (Boleh Kosong)
            'interest' => ['nullable', 'string', 'max:255'],

            // 5. Validasi Password (Opsional - Hanya jika user ingin ganti password)
            // 'current_password' wajib diisi JIKA 'password' (baru) diisi
            'current_password' => ['nullable', 'required_with:password', 'current_password'],
            
            // 'password' (baru) harus dikonfirmasi (ketik ulang) dan beda dari yang lama
            'password' => ['nullable', 'confirmed', 'min:8', 'different:current_password'],
        ];
    }

    /**
     * Custom pesan error agar lebih mudah dipahami user (Bahasa Indonesia)
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            
            'username.required' => 'Username wajib diisi.',
            'username.alpha_dash' => 'Username hanya boleh berisi huruf, angka, strip (-), dan underscore (_).',
            'username.unique' => 'Username ini sudah dipakai orang lain.',
            
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah terdaftar.',

            'current_password.required_with' => 'Harap masukkan password lama untuk mengubah password.',
            'current_password.current_password' => 'Password lama yang Anda masukkan salah.',
            
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
            'password.min' => 'Password baru minimal 8 karakter.',
            'password.different' => 'Password baru tidak boleh sama dengan password lama.',
        ];
    }
}