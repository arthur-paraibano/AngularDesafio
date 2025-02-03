import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PessoaModel } from '../../domain/models/PessoaModel';
import { PessoaServiceService } from '../../services/pessoa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pessoas: PessoaModel[] = [];
  filteredNomes: string[] = [];
  nome: string = '';
  dataNasc: string = '';
  cpf: string = '';
  altura: number | null = null;
  peso: number | null = null;
  sexo: string = '';
  private searchTerms = new Subject<string>();

  constructor(private pessoaService: PessoaServiceService) {}

  ngOnInit(): void {
    this.carregarPessoas();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.filtrarNomes(query);
    });
  }

  carregarPessoas() {
    this.pessoaService.getAllPessoas().subscribe({
      next: (data: PessoaModel[]) => {
        this.pessoas = data;
      },
      error: (error) => {
        console.error('Erro ao carregar pessoas:', error);
      }
    });
  }

  onInputChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchTerms.next(query);
  }

  filtrarNomes(query: string) {
    if (query) {
      this.filteredNomes = this.pessoas
        .filter(pessoa => pessoa.nome.toLowerCase().includes(query))
        .map(pessoa => pessoa.nome)
        .slice(0, 3);

      if (this.filteredNomes.length === 0) {
        this.filteredNomes = ["não encontrado"];
      }
    } else {
      this.filteredNomes = [];
    }
  }

  selecionarNome(nome: string) {
    if (nome !== "não encontrado") {
      this.nome = nome;
      this.pesquisar(nome);
    }
    this.filteredNomes = [];
  }

  incluir() {
    if (!this.nome || !this.dataNasc || !this.cpf || !this.altura || !this.peso || !this.sexo) {
      document.getElementById('erro')!.innerText = "Preencha todos os campos!";
      return;
    }

    const pessoa: PessoaModel = {
      id: 0, // Deixe o ID para o servidor gerar
      nome: this.nome,
      dataNasc: new Date(this.dataNasc),
      cpf: this.cpf,
      sexo: this.sexo,
      altura: this.altura!,
      peso: this.peso!
    };

    this.pessoaService.createPessoa(pessoa).subscribe({
      next: () => {
        document.getElementById('resultado')!.innerText = "Pessoa incluída com sucesso!";
        this.resetForm();
        this.carregarPessoas();
      },
      error: (error) => {
        console.error('Erro ao incluir pessoa:', error);
        document.getElementById('erro')!.innerText = "Erro ao incluir pessoa. Verifique os dados e tente novamente.";
      }
    });
  }

  pesquisar(nome: string) {
    this.pessoaService.getPessoaByNome(nome).subscribe({
      next: (data) => {
        if (data) {
          this.nome = data.nome;
          this.dataNasc = data.dataNasc.toISOString().split('T')[0];
          this.cpf = data.cpf;
          this.altura = data.altura;
          this.peso = data.peso;
          this.sexo = data.sexo;

          this.filteredNomes = [data.nome];
        } else {
          this.filteredNomes = ["não encontrado"];
        }
      },
      error: (error) => {
        console.error('Erro ao pesquisar pessoa:', error);
        this.filteredNomes = ["não encontrado"];
      }
    });
  }

  resetForm() {
    this.nome = '';
    this.dataNasc = '';
    this.cpf = '';
    this.altura = null;
    this.peso = null;
    this.sexo = '';
    this.filteredNomes = [];

    const form = document.getElementById('pessoaForm') as HTMLFormElement;
    if (form) {
        form.reset();
    }
  }

  alterar() {
    // Implementar lógica de alteração
  }

  excluir() {
    // Implementar lógica de exclusão
  }

  calcularPesoIdeal() {
    // Implementar lógica de cálculo de peso ideal
  }

  fecharPesoIdeal() {
    // Implementar lógica para fechar a modal de peso ideal
  }
}
