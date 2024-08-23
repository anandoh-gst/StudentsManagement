package com.nandonecode.sbrdemo.service;

import com.nandonecode.sbrdemo.exception.StudentExistsException;
import com.nandonecode.sbrdemo.exception.StudentNotFoundException;
import com.nandonecode.sbrdemo.model.Student;
import com.nandonecode.sbrdemo.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService implements IStudentService{

    private final StudentRepository studentRepository;

    @Override
    public Student addStudent(Student student) {

        if(studentExists(student.getEmail())){
            throw new StudentExistsException(student.getEmail() + " already exists!");
        }
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student updateStudent(Student student, Long id) {
        return studentRepository.findById(id).map(st -> {
            st.setFirstname(student.getFirstname());
            st.setLastname(student.getLastname());
            st.setEmail(student.getEmail());
            st.setDepartment(student.getDepartment());

            return studentRepository.save(st);
        }).orElseThrow( () -> new StudentNotFoundException("Sorry, this student could not be found"));
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow( () -> new StudentNotFoundException("Id: "+ id + " Sorry, student not found! Probably don't exist"));
    }

    @Override
    public String deleteStudent(Long id) {
        String message;

        if(!studentRepository.existsById(id)){
            message = "Id: \"+ id + \" Sorry, student not found! Probably don't exist";
            throw new StudentNotFoundException(message);
        }else{
            studentRepository.deleteById(id);
            message = "Student with ID: " + id + " has been sucessfully deleted";
        }
        return message;
    }

    private boolean studentExists(String email) {
        return studentRepository.findByEmail(email).isPresent();
    }

}
