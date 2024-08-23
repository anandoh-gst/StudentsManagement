package com.nandonecode.sbrdemo.service;

import com.nandonecode.sbrdemo.model.Student;

import java.util.List;

public interface IStudentService {

    Student addStudent(Student student);

    List<Student> getStudents();

    Student updateStudent(Student student, Long id);

    Student getStudentById(Long id);

    String deleteStudent(Long id);
}
