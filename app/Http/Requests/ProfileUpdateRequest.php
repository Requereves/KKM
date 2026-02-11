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
            'name' => ['required', 'string', 'max:255'],
            
            // ✅ TAMBAHAN: Validasi Username (Wajib, Unik, Tanpa Spasi)
            'username' => [
                'required', 
                'string', 
                'max:255', 
                'alpha_dash', // Hanya huruf, angka, dash (-), dan underscore (_)
                Rule::unique(User::class)->ignore($this->user()->id)
            ],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            // 👇 Validasi Interest (Sesuai kode awal kamu)
            'interest' => ['nullable', 'string', 'max:255'],

            // 👇 TAMBAHAN PENTING: Validasi Password (Opsional)
            // Hanya divalidasi JIKA user mengisi kolom 'password' baru
            'current_password' => ['nullable', 'required_with:password', 'current_password'], 
            'password' => ['nullable', 'confirmed', 'min:8', 'different:current_password'],
        ];
    }

    /**
     * Custom pesan error agar lebih user friendly (Opsional)
     */
    public function messages(): array
    {
        return [
            'username.alpha_dash' => 'Username hanya boleh berisi huruf, angka, strip (-), dan underscore (_).',
            'username.unique' => 'Username ini sudah dipakai orang lain.',
            'current_password.current_password' => 'Password lama yang Anda masukkan salah.',
            'current_password.required_with' => 'Harap masukkan password lama untuk mengubah password.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
            'password.different' => 'Password baru tidak boleh sama dengan password lama.',
        ];
    }
}